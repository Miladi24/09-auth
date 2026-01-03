import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // ===============================
  // 1️⃣ НЕМАЄ accessToken
  // ===============================
  if (!accessToken) {
    let refreshed = false;

    if (refreshToken) {
      try {
        const res = await checkServerSession();
        const setCookie = res.headers['set-cookie'];

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);

            const options = {
              path: parsed.Path,
              maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            };

            if (parsed.accessToken) {
              cookieStore.set('accessToken', parsed.accessToken, options);
              refreshed = true;
            }

            if (parsed.refreshToken) {
              cookieStore.set('refreshToken', parsed.refreshToken, options);
            }
          }
        }
      } catch {
        refreshed = false;
      }
    }

    // ❗ КЛЮЧОВИЙ ФІКС
    if (!refreshed) {
      if (isPrivateRoute) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }

      return NextResponse.next();
    }

    // refresh успішний
    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next({
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
  }

  // ===============================
  // 2️⃣ accessToken ІСНУЄ
  // ===============================
  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};

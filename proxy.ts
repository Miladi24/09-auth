import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;

  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  // 🔐 залогінений → не пускати на auth-сторінки
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 🔒 не залогінений → не пускати на private
  if (!accessToken && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};

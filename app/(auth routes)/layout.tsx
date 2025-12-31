'use client';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthProps) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return children;
}
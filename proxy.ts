import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

type ProtectedRoute = {
  path: string;
  redirect: string;
};

const protectedRoutes: ProtectedRoute[] = [
  { path: '/dashboard', redirect: '/login' },
];

const publicRoutes = ['/login', '/register'];

export default auth((req: NextRequest & { auth: any }) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  // Check if user is trying to access a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route.path)
  );

  // Check if user is on a public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // Redirect to login if trying to access protected route while not authenticated
  if (isProtectedRoute && !isLoggedIn) {
    const redirectUrl = new URL('/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to dashboard if already logged in and trying to access login
  if (isPublicRoute && isLoggedIn) {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to dashboard if logged in and on root
  if (pathname === '/' && isLoggedIn) {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|widget).*)'],
};

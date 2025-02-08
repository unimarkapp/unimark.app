import { getSessionCookie } from 'better-auth';
import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login'];

export default async function authMiddleware(request: NextRequest) {
  if (publicRoutes.some((route) => route === request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const cookies = getSessionCookie(request);

  if (!cookies) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};

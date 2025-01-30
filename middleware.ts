import { betterFetch } from '@better-fetch/fetch';
import type { Session } from '@/shared/auth/server';
import { NextResponse, type NextRequest } from 'next/server';

const publicRoutes = ['/login', '/register'];

export default async function authMiddleware(request: NextRequest) {
  if (publicRoutes.some((route) => route === request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get('cookie') || '',
    },
  });

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};

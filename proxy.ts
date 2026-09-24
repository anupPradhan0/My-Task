import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE, sessionMatches } from '@/lib/site-auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sitePassword = process.env.SITE_PASSWORD;

  // MCP uses Bearer MCP_API_KEY — not the site cookie
  if (pathname === '/mcp' || pathname.startsWith('/api/mcp')) {
    return NextResponse.next();
  }

  // On Vercel, require SITE_PASSWORD. Locally without it, stay open for easy dev.
  if (!sitePassword) {
    if (process.env.VERCEL) {
      if (pathname === '/login') return NextResponse.next();
      return NextResponse.redirect(new URL('/login?error=config', request.url));
    }
    return NextResponse.next();
  }

  if (pathname === '/login') {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(AUTH_COOKIE)?.value;
  if (await sessionMatches(cookie, sitePassword)) {
    return NextResponse.next();
  }

  const login = new URL('/login', request.url);
  login.searchParams.set('next', pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

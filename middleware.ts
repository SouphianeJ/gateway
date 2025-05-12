import { NextResponse, NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  // Allow public and auth routes
  if (
    url.pathname.startsWith('/api/auth') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/login') 
  ) return NextResponse.next();

  const sessionCookie = req.cookies.get(process.env.SESSION_COOKIE_NAME!)?.value;
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Validate session cookie via validate-token endpoint
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/validate-token`,
    { headers: { cookie: req.headers.get('cookie') || '' } }
  );
  if (res.ok) return NextResponse.next();
  return NextResponse.redirect(new URL('/login', req.url));
}

export const config = { matcher: ['/((?!api/auth|_next|login|favicon.ico).*)'] };
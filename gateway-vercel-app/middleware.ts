import { NextResponse, NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Autorise le panel d'auth et assets
  if (url.pathname.startsWith('/api/auth') || url.pathname.startsWith('/_next') || url.pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  const token = req.cookies.get('__Secure-auth.session-token')?.value;
  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Validation via l'API interne
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/validate-token`,
    { headers: { cookie: req.headers.get('cookie') || '' } }
  );

  if (res.ok) {
    return NextResponse.next();
  }

  url.pathname = '/login';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api/auth|_next|favicon.ico).*)'],
};
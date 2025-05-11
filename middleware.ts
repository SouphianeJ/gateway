// middleware.ts
import { NextResponse, NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Laisse passer les routes d'auth, login, assets et pages publiques
  if (
    url.pathname.startsWith('/api/auth') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/login') ||
    url.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get('__Secure-auth.session-token')?.value;
  if (!token) {
    // Redirige vers la page de login sans créer de boucle
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Validation du token auprès du portail
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/validate-token`,
    { headers: { cookie: req.headers.get('cookie') || '' } }
  );

  if (res.ok) {
    return NextResponse.next();
  }

  // Token invalide ou expiré
  return NextResponse.redirect(new URL('/login', req.url));
}

export const config = {
  matcher: ['/((?!api/auth|_next|login|favicon.ico).*)'],
}; {
  matcher: ['/((?!api/auth|_next|favicon.ico).*)'],
};
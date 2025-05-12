import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '../../../../lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();
  const expiresIn = Number(process.env.SESSION_COOKIE_MAX_AGE);
  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(process.env.SESSION_COOKIE_NAME!, sessionCookie, {
      httpOnly: true,
      secure: true,
      maxAge: expiresIn / 1000,
      path: '/',
      sameSite: 'lax'
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: 'Invalid ID token' }, { status: 401 });
  }
}
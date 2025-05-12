import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '../../../../lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get(process.env.SESSION_COOKIE_NAME!)?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: 'No session cookie' }, { status: 401 });
  }
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return NextResponse.json({ user: decoded });
  } catch {
    return NextResponse.json({ error: 'Invalid session cookie' }, { status: 401 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

const publicKey = process.env.JWT_PUBLIC_KEY!.replace(/\\n/g, '\n');

export async function GET(req: NextRequest) {
  const token = req.cookies.get('__Secure-auth.session-token')?.value;
  if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 });

  try {
    const { payload } = await jose.jwtVerify(
      token,
      await jose.importSPKI(publicKey, 'RS256')
    );
    return NextResponse.json({ user: (payload as any).user || payload }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
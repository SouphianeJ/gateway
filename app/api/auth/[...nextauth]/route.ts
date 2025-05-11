import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import * as jose from 'jose';

const privateKey = process.env.JWT_PRIVATE_KEY!.replace(/\\n/g, '\n');

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: { username: { label: 'Username', type: 'text' }, password: { label: 'Password', type: 'password' } },
      async authorize(credentials) {
        if (credentials && credentials.username === 'admin' && credentials.password === 'supersecret') {
          return { id: '1', name: 'Admin' };
        }
        return null;
      }
    })
  ],
  session: { strategy: 'jwt' },
  jwt: {
    encode: async ({ token }) => {
      return new jose.SignJWT(token)
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(await jose.importPKCS8(privateKey, 'RS256'));
    },
    decode: async () => { throw new Error('Decode not used'); }
  },
  callbacks: {
    async jwt({ token, user }) { if (user) token.user = user; return token; },
    async session({ session, token }) { session.user = (token as any).user; return session; }
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: '__Secure-auth.session-token',
      options: { httpOnly: true, secure: true, sameSite: 'Lax', path: '/', domain: 'gateway.vercel.app' }
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

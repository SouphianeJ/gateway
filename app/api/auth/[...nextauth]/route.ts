// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import * as jose from 'jose';

// Clé privée pour signature JWT
const privateKey = process.env.JWT_PRIVATE_KEY!.replace(/\\n/g, '\n');

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials?.username === 'admin' && credentials.password === 'supersecret') {
          return { id: '1', name: 'Admin' };
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  jwt: {
    encode: async ({ token }) => {
      const alg = 'RS256';
      // token may be undefined, fallback to empty payload
      const payload: jose.JWTPayload = token ? (token as jose.JWTPayload) : {};
      return new jose.SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(await jose.importPKCS8(privateKey, alg));
    },
    decode: async () => {
      throw new Error('Decode non utilisé');
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = (token as any).user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: '__Secure-auth.session-token',
      options: {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        path: '/',
        domain: 'gateway.vercel.app',
      },
    },
  },
});

export { handler as GET, handler as POST };

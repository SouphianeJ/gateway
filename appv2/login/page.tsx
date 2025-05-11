'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push('/app1');
    return null;
  }

  return (
    <div>
      <h1>Connexion</h1>
      <form onSubmit={e => {
        e.preventDefault();
        const u = (e.currentTarget.username as HTMLInputElement).value;
        const p = (e.currentTarget.password as HTMLInputElement).value;
        signIn('credentials', { username: u, password: p, callbackUrl: '/app1' });
      }}>
        <input name="username" placeholder="Username" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

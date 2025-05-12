import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Gateway SSO</h1>
      <nav>
        <ul>
          <li><Link href="https://code-builder-git-massrework-souphianejs-projects.vercel.app">App1</Link></li>
          <li><Link href="/app2">App2</Link></li>
        </ul>
      </nav>
    </main>
  );
}

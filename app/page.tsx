import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Gateway </h1>
      <nav>
        <ul>
          <li><Link href="https://code-builder-git-massrework-souphianejs-projects.vercel.app">Code-builder</Link></li>
          <li><Link href="https://prompt-shop.vercel.app/">Prompt Gallery</Link></li>
          <li><Link href="https://cmd-sheetcheat.vercel.app/">Cmd Gallery</Link></li>
        </ul>
      </nav>
    </main>
  );
}

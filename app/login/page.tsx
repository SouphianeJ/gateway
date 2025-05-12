'use client'
import { useState, useEffect } from 'react'

export default function LoginPage() {
  const [callbackUrl, setCallbackUrl] = useState('/protected')

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.has('callbackUrl')) {
      setCallbackUrl(decodeURIComponent(p.get('callbackUrl')!))
    }
  }, [])

  return (
    <main style={{ padding: 20 }}>
      <h1>Connexion</h1>
      <form method="POST" action="/api/auth/login">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div>
          <input name="email" type="email" placeholder="Email" required />
        </div>
        <div style={{ marginTop: 8 }}>
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            required
          />
        </div>
        <button style={{ marginTop: 12 }} type="submit">
          Se connecter
        </button>
      </form>
    </main>
  )
}

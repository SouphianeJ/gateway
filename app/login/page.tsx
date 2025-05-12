'use client'

import { useState, useEffect } from 'react'

export default function LoginPage() {
  const [callbackUrl, setCallbackUrl] = useState<string>('/protected')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setCallbackUrl(params.get('callbackUrl') || '/protected')
  }, [])

  return (
    <main style={{ padding: 20 }}>
      <h1>Connexion</h1>
      <form method="POST" action="/api/auth/login">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div style={{ margin: '8px 0' }}>
          <input name="email" type="email" placeholder="Email" required />
        </div>
        <div style={{ margin: '8px 0' }}>
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            required
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </main>
  )
}

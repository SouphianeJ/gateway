import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const TOKEN_EXPIRY = '1h'
const CLIENT_EXCHANGE = 'https://code-builder-git-massrework-souphianejs-projects.vercel.app/api/auth/exchange'

async function verifyUser(email: string, password: string) {
  // À remplacer par votre logique (BDD, Firebase Admin…)
  if (email === 's.jender@ileps.fr' && password === '123') {
    return { id: '42', email }
  }
  return null
}

export async function POST(req: NextRequest) {
  // 1) on récupère les formData
  const form = await req.formData()
  const email = form.get('email') as string
  const password = form.get('password') as string
  const rawCb = form.get('callbackUrl') as string | null
  const callbackUrl = rawCb ? decodeURIComponent(rawCb) : '/protected'

  // 2) validation des credentials
  const user = await verifyUser(email, password)
  if (!user) {
    return NextResponse.redirect('/login?error=invalid_credentials')
  }

  // 3) génération du JWT
  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  })

  // 4) on renvoie un mini-HTML POST auto vers l'app cliente
  const safeCb = encodeURIComponent(callbackUrl)
  const html = `<!DOCTYPE html>
<html>
  <body>
    <form id="f" method="post" action="${CLIENT_EXCHANGE}">
      <input type="hidden" name="token" value="${token}" />
      <input type="hidden" name="callbackUrl" value="${safeCb}" />
    </form>
    <script>document.getElementById('f').submit();</script>
  </body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
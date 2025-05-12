import type { NextApiRequest, NextApiResponse } from 'next'
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  const { email, password, callbackUrl } = req.body
  const user = await verifyUser(email, password)
  if (!user) {
    return res.status(401).end('Invalid credentials')
  }

  // 1) Génère le JWT
  const token = jwt.sign(
    { sub: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  )

  // 2) Renvoie un mini-HTML POST auto au client
  const safeCb = encodeURIComponent(callbackUrl || '/protected')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        <form id="f" method="POST" action="${CLIENT_EXCHANGE}">
          <input type="hidden" name="token" value="${token}" />
          <input type="hidden" name="callbackUrl" value="${safeCb}" />
        </form>
        <script>document.getElementById('f').submit();</script>
      </body>
    </html>
  `)
}

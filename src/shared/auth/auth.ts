import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'

export const authPlugin = new Elysia({ name: 'auth' })
  .use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET! }))
  .derive(async ({ jwt, request, cookie: { auth } }) => {
    const authHeader = request.headers.get('authorization')

    let token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : undefined

    if (!token && auth?.value) {
      token = auth.value
    }

    const payload = token ? await jwt.verify(token).catch(() => null) : null

    return {
      user: payload as null | {
        sub: string
        role: 'VIEWER' | 'MEMBER' | 'ANALYST' | 'SUPERVISOR' | 'ADMIN'
      },
      token,
    }
  })
  .as('scoped')

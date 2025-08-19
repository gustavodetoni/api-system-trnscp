import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'

export const authPlugin = new Elysia({ name: 'auth' })
  .use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET! }))
  .derive(async ({ jwt, cookie: { auth } }) => {
    const payload = auth?.value
      ? await jwt.verify(auth.value).catch(() => null)
      : null
    return {
      user: payload as {
        role: 'VIEWER' | 'MEMBER' | 'ANALYST' | 'SUPERVISOR' | 'ADMIN'
      },
    }
  })
  .as('scoped')

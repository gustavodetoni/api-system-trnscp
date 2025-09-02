import { Elysia, t } from 'elysia'
import { z } from 'zod'
import { jwt } from '@elysiajs/jwt'
import { registerUser } from '../../core/use-cases/auth/register-user'
import { loginUser } from '../../core/use-cases/auth/login-user'

export const authRoutes = new Elysia({ name: 'routes:auth', prefix: '/auth' })
  .use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET! }))
  .post(
    '/register',
    async ({ body }) => {
      const data = z
        .object({
          name: z.string().min(2),
          email: z.string().email(),
          password: z.string().min(6),
          role: z
            .enum(['VIEWER', 'MEMBER', 'ANALYST', 'SUPERVISOR', 'ADMIN'])
            .optional(),
        })
        .parse(body)

      const created = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      return created
    },
    {
      detail: { tags: ['Auth'] },
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    '/login',
    async ({ body, jwt, cookie }) => {
      const creds = z
        .object({
          email: z.string().email(),
          password: z.string().min(6),
        })
        .parse(body)

      const user = await loginUser({
        email: creds.email,
        password: creds.password,
      })

      const token = await jwt.sign({ sub: user.id, role: user.role })

      cookie.auth.set({
        httpOnly: true,
        value: token,
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })

      return {
        accessToken: token,
      }
    },
    {
      detail: { tags: ['Auth'] },
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )

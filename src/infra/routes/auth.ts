import { Elysia, t } from 'elysia'
import { authPlugin } from '../../shared/auth/auth'
import { registerUser } from '../../core/use-cases/auth/register-user'
import { loginUser } from '../../core/use-cases/auth/login-user'

export const authRoutes = new Elysia()
  .use(authPlugin)
  .post(
    '/register',
    async ({ body, jwt }) => {
      const created = await registerUser(body)
      const token = await jwt.sign({
        sub: created.id,
        role: created.role,
        plan: created.plan,
      })
      return { token }
    },
    {
      detail: {
        tags: ['Auth'],
        summary: 'Register a new user',
      },
      body: t.Object({
        name: t.String(),
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 6 }),
      }),
      response: t.Object({ token: t.String() }),
    }
  )
  .post(
    '/login',
    async ({ body, jwt }) => {
      const user = await loginUser(body)
      const token = await jwt.sign({
        sub: user.id,
        role: user.role,
        plan: user.plan,
      })
      return { token }
    },
    {
      detail: {
        tags: ['Auth'],
        summary: 'Login',
      },
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String(),
      }),
      response: t.Object({ token: t.String() }),
    }
  )

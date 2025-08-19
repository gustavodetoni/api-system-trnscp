import { drizzle } from 'drizzle-orm/singlestore/driver'
import { Elysia } from 'elysia'
import { requireRole } from './shared/auth/require-auth'
import { authRoutes } from './infra/routes/auth'
import swagger from '@elysiajs/swagger'

const app = new Elysia()
  .get('/health', () => ({ ok: true }))
  .use(
    swagger({
      scalarConfig: {
        theme: 'saturn',
      },
      path: '/docs',
      documentation: {
        info: {
          title: 'System Transcription API',
          version: '1.0.0',
        },
        tags: [{ name: 'Auth', description: 'Autenticação (register/login)' }],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
    })
  )
  .use(authRoutes)
  .listen(3333)

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

import { Elysia } from 'elysia'
import swagger from '@elysiajs/swagger'
import cookie from '@elysiajs/cookie'

import { authRoutes } from './infra/routes/auth'
import { squadRoutes } from './infra/routes/squad'

const app = new Elysia()
  .use(cookie())
  .get('/health', () => ({ ok: true }))
  .use(
    swagger({
      scalarConfig: { theme: 'saturn' },
      path: '/docs',
      documentation: {
        info: { title: 'System Transcription API', version: '1.0.0' },
        tags: [
          { name: 'Auth', description: 'Autenticação (register/login)' },
          { name: 'Squads', description: 'CRUD de Squads' },
        ],
        components: {
          securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    })
  )
  // públicas
  .use(authRoutes)
  // protegidas
  .use(squadRoutes)
  .listen(3333)

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

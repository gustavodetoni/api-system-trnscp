import { Elysia } from 'elysia'
import cookie from '@elysiajs/cookie'

import { authRoutes } from './infra/routes/auth'
import { squadRoutes } from './infra/routes/squad'
import { transcriptionRoutes } from './infra/routes/transcription'
import { SwaggerConfig } from './infra/config/swagger'

const app = new Elysia()
  .use(cookie())
  .get('/health', () => ({ ok: true }))
  .use(SwaggerConfig)
  .use(authRoutes)
  .use(squadRoutes)
  .use(transcriptionRoutes)
  .listen(3333)

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

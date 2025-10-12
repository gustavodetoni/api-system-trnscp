import swagger from '@elysiajs/swagger'
import Elysia from 'elysia'

export const SwaggerConfig = new Elysia({ name: 'swagger' }).use(
  swagger({
    scalarConfig: { theme: 'saturn' },
    path: '/docs',
    documentation: {
      info: { title: 'System Transcription API', version: '1.0.0' },
      tags: [
        { name: 'Auth', description: 'Autenticação (register/login)' },
        { name: 'Squads', description: 'CRUD de Squads' },
        {
          name: 'Transcription',
          description: 'Upload de arquivos para transcrição',
        },
        { name: 'Categories', description: 'CRUD de Categorias' },
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

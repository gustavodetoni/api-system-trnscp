import { Elysia, t } from 'elysia'
import { Unauthorized } from '../../shared/errors/unauthorized'
import { DrizzleTranscriptionRepository } from '../repositories/transcription-repository'
import { UpdateTranscriptionDetailsUseCase } from '../../core/use-cases/transcription/update-transcription'

const transcriptionRepository = new DrizzleTranscriptionRepository()

export const webhookRoutes = new Elysia({
  name: 'routes:webhook',
  prefix: '/webhooks',
}).post(
  '/transcription-processed',
  async ({ body, headers }) => {
    const secret = headers['x-webhook-secret']
    if (secret !== process.env.WEBHOOK_SECRET) {
      throw new Unauthorized('Invalid webhook secret')
    }

    const updateUseCase = new UpdateTranscriptionDetailsUseCase(
      transcriptionRepository
    )

    const processedBody = {
      ...body,
      duration: Math.floor(body.duration || 0),
      keywords: Array.isArray(body.keywords) ? body.keywords : undefined,
    }

    const result = await updateUseCase.execute(processedBody)

    return { ok: true, updatedId: result.id }
  },
  {
    detail: { tags: ['Webhook'] },
    headers: t.Object({
      'x-webhook-secret': t.String(),
    }),
    body: t.Object({
      transcriptionId: t.String(),
      title: t.Optional(t.String()),
      duration: t.Optional(t.Number()),
      squadId: t.Optional(t.String()),
      category: t.Optional(t.String()),
      status: t.Optional(
        t.Union([
          t.Literal('ERROR'),
          t.Literal('UPLOADING'),
          t.Literal('TRANSCRIBING'),
          t.Literal('CATEGORIZING'),
          t.Literal('COMPLETED'),
        ])
      ),
      keywords: t.Optional(t.Array(t.String())),
      resume: t.Optional(t.String()),
    }),
  }
)

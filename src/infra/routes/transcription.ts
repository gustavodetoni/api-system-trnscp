import { Elysia, t } from 'elysia'
import { requireDataAccess } from '../../shared/auth/require-data-access'
import { UploadFileUseCase } from '../../core/use-cases/transcription/upload-file'
import { DrizzleSquadRepository } from '../repositories/squad-repository'
import { DrizzleCategoryRepository } from '../repositories/category-repository'
import { S3StorageRepository } from '../storage/s3-storage-repository'
import { SQSQueueRepository } from '../queue/sqs-queue-repository'
import { Unauthorized } from '../../shared/errors/unauthorized'

import { DrizzleTranscriptionRepository } from '../repositories/transcription-repository'
import { GetTranscriptionUseCase } from '../../core/use-cases/transcription/get-transcription'
import { FetchTranscriptionsBySquadUseCase } from '../../core/use-cases/transcription/fetch-transcriptions-by-squad'
import { UpdateTranscriptionDetailsUseCase } from '../../core/use-cases/transcription/update-transcription'
import { DeleteTranscriptionUseCase } from '../../core/use-cases/transcription/delete-transcription'

const squadRepository = new DrizzleSquadRepository()
const categoryRepository = new DrizzleCategoryRepository()
const storageRepository = new S3StorageRepository()
const queueRepository = new SQSQueueRepository()
const transcriptionRepository = new DrizzleTranscriptionRepository()

export const transcriptionRoutes = new Elysia({
  name: 'routes:transcription',
  prefix: '/transcriptions',
})
  .use(requireDataAccess())
  .get(
    '/:squadId',
    async ({ params, query }) => {
      const fetchTranscriptionsUseCase = new FetchTranscriptionsBySquadUseCase(
        transcriptionRepository
      )

      return await fetchTranscriptionsUseCase.execute({
        squadId: params.squadId,
        page: query.page,
        pageSize: query.pageSize,
        search: query.search,
        category: query.category,
        pinned: query.pinned,
      })
    },
    {
      detail: { tags: ['Transcription'] },
      params: t.Object({
        squadId: t.String(),
      }),
      query: t.Object({
        page: t.Optional(t.Numeric()),
        pageSize: t.Optional(t.Numeric()),
        search: t.Optional(t.String()),
        category: t.Optional(t.String()),
        pinned: t.Optional(t.Boolean()),
      }),
    }
  )
  .get(
    '/details/:transcriptionId',
    async ({ params }) => {
      const getTranscriptionUseCase = new GetTranscriptionUseCase(
        transcriptionRepository
      )

      return await getTranscriptionUseCase.execute({
        transcriptionId: params.transcriptionId,
      })
    },
    {
      detail: { tags: ['Transcription'] },
      params: t.Object({
        transcriptionId: t.String(),
      }),
    }
  )
  .post(
    '/upload-files/:squadId',
    async ({ params, body, currentUserId }) => {
      if (!currentUserId) {
        throw new Unauthorized('User not authenticated')
      }

      const uploadFileUseCase = new UploadFileUseCase(
        squadRepository,
        categoryRepository,
        storageRepository,
        queueRepository,
        transcriptionRepository
      )

      const { squadId } = params
      const { files } = body

      if (!files.length) {
        throw new Error('Nenhum arquivo enviado')
      }

      const results = await Promise.all(
        files.map(async (file) => {
          return uploadFileUseCase.execute({
            userId: currentUserId,
            squadId,
            file: {
              name: file.name,
              type: file.type,
              arrayBuffer: () => file.arrayBuffer(),
            },
          })
        })
      )

      return { success: true, results }
    },
    {
      detail: { tags: ['Transcription'] },
      params: t.Object({
        squadId: t.String(),
      }),
      body: t.Object({
        files: t.Files({
          type: ['audio/mpeg', 'audio/x-m4a', 'audio/wav', 'video/mp4'],
          maxSize: '100m',
        }),
      }),
    }
  )
  .put(
    '/:transcriptionId',
    async ({ params, body }) => {
      const updateTranscriptionUseCase = new UpdateTranscriptionDetailsUseCase(
        transcriptionRepository
      )

      return await updateTranscriptionUseCase.execute({
        transcriptionId: params.transcriptionId,
        ...body,
      })
    },
    {
      detail: { tags: ['Transcription'] },
      params: t.Object({
        transcriptionId: t.String(),
      }),
      body: t.Object({
        title: t.Optional(t.String()),
        duration: t.Optional(t.Number()),
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
  .delete(
    '/:transcriptionId',
    async ({ params }) => {
      const deleteTranscriptionUseCase = new DeleteTranscriptionUseCase(
        transcriptionRepository
      )

      await deleteTranscriptionUseCase.execute({
        transcriptionId: params.transcriptionId,
      })

      return { success: true }
    },
    {
      detail: { tags: ['Transcription'] },
      params: t.Object({
        transcriptionId: t.String(),
      }),
    }
  )

import { Elysia, t } from 'elysia'
import { requireDataAccess } from '../../shared/auth/require-data-access'
import { UploadFileUseCase } from '../../core/use-cases/transcription/upload-file'
import { DrizzleSquadRepository } from '../repositories/squad-repository'
import { DrizzleCategoryRepository } from '../repositories/category-repository'
import { S3StorageRepository } from '../storage/s3-storage-repository'
import { SQSQueueRepository } from '../queue/sqs-queue-repository'
import { Unauthorized } from '../../shared/errors/unauthorized'

import { DrizzleTranscriptionRepository } from '../repositories/transcription-repository'

const squadRepository = new DrizzleSquadRepository()
const categoryRepository = new DrizzleCategoryRepository()
const storageRepository = new S3StorageRepository()
const queueRepository = new SQSQueueRepository()
const transcriptionRepository = new DrizzleTranscriptionRepository()

export const transcriptionRoutes = new Elysia({
  name: 'routes:transcription',
})
  .use(requireDataAccess())
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

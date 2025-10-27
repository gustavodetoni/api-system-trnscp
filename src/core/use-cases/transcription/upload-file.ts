import { randomUUID } from 'node:crypto'
import { SquadRepository } from '../../repositories/squad-repository'
import { StorageRepository } from '../../repositories/storage-repository'
import { QueueRepository } from '../../repositories/queue-repository'
import { CategoryRepository } from '../../repositories/category-repository'
import { NotFound } from '../../../shared/errors/not-found'
import { TranscriptionRepository } from '../../repositories/transcription-repository'

type UploadFileRequest = {
  userId: string
  squadId: string
  file: {
    name: string
    type: string
    arrayBuffer: () => Promise<ArrayBuffer>
  }
}

type UploadFileResponse = {
  success: boolean
  message: string
}

export class UploadFileUseCase {
  constructor(
    private squadRepository: SquadRepository,
    private categoryRepository: CategoryRepository,
    private storageRepository: StorageRepository,
    private queueRepository: QueueRepository,
    private transcriptionRepository: TranscriptionRepository
  ) {}

  async execute({
    userId,
    squadId,
    file,
  }: UploadFileRequest): Promise<UploadFileResponse> {
    try {
      const squad = await this.squadRepository.findById(squadId, userId)

      if (!squad) {
        throw new NotFound('Squad not found')
      }

      const fileId = randomUUID()
      const fileExtension = file.name.split('.').pop()
      const fileName = `${fileId}.${fileExtension}`

      const fileBuffer = Buffer.from(await file.arrayBuffer())

      const upload = await this.storageRepository.upload({
        fileName,
        body: fileBuffer,
        contentType: file.type,
      })

      if (!upload) {
        throw new Error('Failed to upload file to bucket')
      }

      const transcription = await this.transcriptionRepository.create({
        name: file.name,
        squadId,
        status: 'UPLOADING',
      })

      const categories = await this.categoryRepository.findBySquadId(squadId)

      if (!process.env.AWS_SQS_QUEUE_URL) {
        throw new Error('AWS_SQS_QUEUE_URL is not set')
      }

      if (!process.env.TOKEN_WHISPER) {
        throw new Error('TOKEN_WHISPER is not set')
      }

      const message = {
        userId,
        squadId,
        audioUrl: upload.url,
        language: squad.language,
        transcriptionId: transcription.id,
        status: transcription.status,
        categories: categories.map((category) => ({
          category: category.name,
          description: category.description,
        })),
        token: process.env.TOKEN_WHISPER,
      }

      await this.queueRepository.sendMessage({
        queueUrl: process.env.AWS_SQS_QUEUE_URL,
        messageBody: JSON.stringify(message),
      })

      return {
        success: true,
        message: 'Arquivo enviado e em processamento',
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Upload file error',
      }
    }
  }
}

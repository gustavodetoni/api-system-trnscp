import { randomUUID } from 'node:crypto'
import { SquadRepository } from '../../repositories/squad-repository'
import { StorageRepository } from '../../repositories/storage-repository'
import { QueueRepository } from '../../repositories/queue-repository'
import { CategoryRepository } from '../../repositories/category-repository'
import { NotFound } from '../../../shared/errors/not-found'

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
    private queueRepository: QueueRepository
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

      const categories = await this.categoryRepository.findBySquadId(squadId)

      if (!process.env.AWS_SQS_QUEUE_URL) {
        throw new Error('AWS_SQS_QUEUE_URL is not set')
      }

      const message = {
        userId,
        squadId,
        audioUrl: upload.url,
        language: squad.language,
        categories: categories.map((category) => category.name),
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

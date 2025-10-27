import { Transcription } from '../../entities/transcription'
import { TranscriptionRepository } from '../../repositories/transcription-repository'
import { NotFound } from '../../../shared/errors/not-found'

type UpdateTranscriptionDetailsRequest = {
  transcriptionId: string
  title?: string
  duration?: number
  category?: string
  status?: 'ERROR' | 'UPLOADING' | 'TRANSCRIBING' | 'CATEGORIZING' | 'COMPLETED'
  keywords?: string[]
  resume?: string
}

export class UpdateTranscriptionDetailsUseCase {
  constructor(private transcriptionRepository: TranscriptionRepository) {}

  async execute(
    data: UpdateTranscriptionDetailsRequest
  ): Promise<Transcription> {
    const { transcriptionId, ...updateData } = data

    const updatedTranscription = await this.transcriptionRepository.update(
      transcriptionId,
      updateData
    )

    if (!updatedTranscription) {
      throw new NotFound('Transcription not found')
    }

    return updatedTranscription
  }
}

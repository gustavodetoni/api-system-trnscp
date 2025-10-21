import { TranscriptionRepository } from '../../repositories/transcription-repository'
import { NotFound } from '../../../shared/errors/not-found'

type DeleteTranscriptionRequest = {
  transcriptionId: string
}

export class DeleteTranscriptionUseCase {
  constructor(private transcriptionRepository: TranscriptionRepository) {}

  async execute(data: DeleteTranscriptionRequest): Promise<void> {
    const { transcriptionId } = data

    const transcription = await this.transcriptionRepository.findById(
      transcriptionId
    )

    if (!transcription) {
      throw new NotFound('Transcription not found')
    }

    await this.transcriptionRepository.delete(transcriptionId)
  }
}

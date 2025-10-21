import { Transcription } from '../../entities/transcription'
import { TranscriptionRepository } from '../../repositories/transcription-repository'
import { NotFound } from '../../../shared/errors/not-found'

type GetTranscriptionRequest = {
  transcriptionId: string
}

export class GetTranscriptionUseCase {
  constructor(private transcriptionRepository: TranscriptionRepository) {}

  async execute(data: GetTranscriptionRequest): Promise<Transcription> {
    const { transcriptionId } = data

    const transcription = await this.transcriptionRepository.findById(
      transcriptionId
    )

    if (!transcription) {
      throw new NotFound('Transcription not found')
    }

    return transcription
  }
}

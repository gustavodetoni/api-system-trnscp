import { Transcription } from '../../entities/transcription'
import { TranscriptionRepository } from '../../repositories/transcription-repository'

type FetchTranscriptionsBySquadRequest = {
  squadId: string
  page?: number
  pageSize?: number
  search?: string
  category?: string
  pinned?: boolean
}

type FetchTranscriptionsResponse = {
  data: Transcription[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export class FetchTranscriptionsBySquadUseCase {
  constructor(private transcriptionRepository: TranscriptionRepository) {}

  async execute(
    data: FetchTranscriptionsBySquadRequest
  ): Promise<FetchTranscriptionsResponse> {
    const { squadId, page = 1, pageSize = 20, search, category, pinned } = data

    const result = await this.transcriptionRepository.findManyBySquadId({
      squadId,
      page,
      pageSize,
      search,
      category,
      pinned,
    })

    const { data: transcriptions, total } = result
    const totalPages = Math.ceil(total / pageSize)

    return {
      data: transcriptions,
      meta: {
        page,
        pageSize,
        total,
        totalPages,
        hasNextPage: page * pageSize < total,
        hasPreviousPage: page > 1,
      },
    }
  }
}

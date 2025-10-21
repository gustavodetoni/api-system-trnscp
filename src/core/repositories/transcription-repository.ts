import { Transcription } from '../entities/transcription'

type FindManyResult = {
  data: Transcription[]
  total: number
}

export interface TranscriptionRepository {
  create(
    data: Omit<
      Transcription,
      | 'id'
      | 'title'
      | 'keywords'
      | 'resume'
      | 'duration'
      | 'category'
      | 'pinned'
    >
  ): Promise<Transcription>

  update(
    id: string,
    data: Partial<Omit<Transcription, 'id' | 'squadId' | 'name'>>
  ): Promise<Transcription | null>

  findById(id: string): Promise<Transcription | null>
  findManyBySquadId(data: {
    squadId: string
    page?: number
    pageSize?: number
    search?: string
    category?: string
    pinned?: boolean
  }): Promise<FindManyResult>
  delete(id: string): Promise<void>
}

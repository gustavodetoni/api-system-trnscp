import { Transcription } from '../entities/transcription'

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
}

import { eq } from 'drizzle-orm'
import { Transcription } from '../../core/entities/transcription'
import { TranscriptionRepository } from '../../core/repositories/transcription-repository'
import { db } from '../database/drizzle'
import { transcriptions } from '../database/schema'

export class DrizzleTranscriptionRepository implements TranscriptionRepository {
  async create(
    data: Omit<
      Transcription,
      'id' | 'keywords' | 'resume' | 'duration' | 'category' | 'pinned'
    >
  ): Promise<Transcription> {
    const [created] = await db.insert(transcriptions).values(data).returning()
    return created as Transcription
  }

  async update(
    id: string,
    data: Partial<Omit<Transcription, 'id' | 'squadId' | 'name'>>
  ): Promise<Transcription | null> {
    const [updated] = await db
      .update(transcriptions)
      .set(data)
      .where(eq(transcriptions.id, id))
      .returning()

    return (updated as Transcription) || null
  }
}

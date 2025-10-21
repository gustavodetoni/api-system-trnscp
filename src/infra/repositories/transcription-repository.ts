import { and, desc, eq, sql } from 'drizzle-orm'
import { Transcription } from '../../core/entities/transcription'
import { TranscriptionRepository } from '../../core/repositories/transcription-repository'
import { db } from '../database/drizzle'
import { transcriptions } from '../database/schema'

type FindManyResult = {
  data: Transcription[]
  total: number
}

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

  async findById(id: string): Promise<Transcription | null> {
    const [found] = await db
      .select()
      .from(transcriptions)
      .where(and(eq(transcriptions.id, id), eq(transcriptions.isDeleted, false)))

    return (found as Transcription) || null
  }

  async findManyBySquadId(data: {
    squadId: string
    page?: number
    pageSize?: number
    search?: string
    category?: string
    pinned?: boolean
  }): Promise<FindManyResult> {
    const { squadId, page = 1, pageSize = 20, search, category, pinned } = data

    const where = [eq(transcriptions.squadId, squadId)]

    if (search) {
      where.push(
        sql`(${transcriptions.name} ilike ${`%${search}%`} or ${transcriptions.title} ilike ${`%${search}%`})`
      )
    }

    if (category) {
      where.push(eq(transcriptions.category, category))
    }

    if (pinned !== undefined) {
      where.push(eq(transcriptions.pinned, pinned))
    }

    const filters = and(...where)

    const found = await db
      .select()
      .from(transcriptions)
      .where(filters)
      .orderBy(desc(transcriptions.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize)

    const [{ value: total }] = await db
      .select({ value: sql<number>`count(*)` })
      .from(transcriptions)
      .where(filters)

    return {
      data: found as Transcription[],
      total,
    }
  }

  async delete(id: string): Promise<void> {
    await db
      .update(transcriptions)
      .set({ isDeleted: true })
      .where(eq(transcriptions.id, id))
  }
}

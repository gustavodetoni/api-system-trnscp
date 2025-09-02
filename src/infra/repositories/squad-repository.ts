import { and, desc, ilike, sql, eq, inArray } from 'drizzle-orm'
import { Squad } from '../../core/entities/squad'
import { SquadRepository } from '../../core/repositories/squad-repository'
import { db } from '../database/drizzle'
import { squads, userSquads } from '../database/schema'

type FindManyFilters = {
  search?: string
  page?: number
  pageSize?: number
  userId?: string
  isAdmin?: boolean
}

type FindManyResult = {
  data: Squad[]
  total: number
}

export class DrizzleSquadRepository implements SquadRepository {
  async create(
    data: Omit<Squad, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Squad> {
    const [created] = await db.insert(squads).values(data).returning()
    return created as Squad
  }

  async findById(id: string, userId?: string, isAdmin = false): Promise<Squad | null> {
    if (isAdmin) {
      const squad = await db.query.squads.findFirst({
        where: (squads, { eq, and }) =>
          and(eq(squads.id, id), eq(squads.isDeleted, false))
      })
      return squad as Squad | null
    }

    if (!userId) {
      return null
    }

    const squad = await db
      .select({
        id: squads.id,
        name: squads.name,
        description: squads.description,
        language: squads.language,
        createdAt: squads.createdAt,
        updatedAt: squads.updatedAt,
        deletedAt: squads.deletedAt
      })
      .from(squads)
      .innerJoin(userSquads, eq(squads.id, userSquads.squadId))
      .where(
        and(
          eq(squads.id, id),
          eq(squads.isDeleted, false),
          eq(userSquads.userId, userId),
          eq(userSquads.isDeleted, false)
        )
      )
      .limit(1)

    return squad[0] as Squad | null
  }

  async findMany(filters?: FindManyFilters): Promise<FindManyResult> {
    const { search, page = 1, pageSize = 20, userId, isAdmin = false } = filters || {}

    const baseFilters = [eq(squads.isDeleted, false)] as any[]

    if (search) {
      baseFilters.push(ilike(squads.name, `%${search}%`))
    }

    if (isAdmin) {
      const where = and(...baseFilters)

      const data = await db
        .select()
        .from(squads)
        .where(where)
        .orderBy(desc(squads.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize)

      const [{ value: total }] = await db
        .select({ value: sql<number>`count(*)` })
        .from(squads)
        .where(where)

      return {
        data: data as Squad[],
        total
      }
    }

    if (!userId) {
      return { data: [], total: 0 }
    }

    const userSquadFilters = [
      eq(userSquads.userId, userId),
      eq(userSquads.isDeleted, false)
    ]

    const data = await db
      .select({
        id: squads.id,
        name: squads.name,
        description: squads.description,
        language: squads.language,
        createdAt: squads.createdAt,
        updatedAt: squads.updatedAt,
        deletedAt: squads.deletedAt
      })
      .from(squads)
      .innerJoin(userSquads, eq(squads.id, userSquads.squadId))
      .where(and(...baseFilters, ...userSquadFilters))
      .orderBy(desc(squads.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize)

    const [{ value: total }] = await db
      .select({ value: sql<number>`count(*)` })
      .from(squads)
      .innerJoin(userSquads, eq(squads.id, userSquads.squadId))
      .where(and(...baseFilters, ...userSquadFilters))

    return {
      data: data as Squad[],
      total
    }
  }

  async update(id: string, data: Partial<Squad>): Promise<Squad | null> {
    const [updated] = await db
      .update(squads)
      .set(data)
      .where(and(eq(squads.id, id), eq(squads.isDeleted, false)))
      .returning()

    return updated as Squad | null
  }

  async delete(id: string): Promise<Squad | null> {
    const [deleted] = await db
      .update(squads)
      .set({ isDeleted: true })
      .where(eq(squads.id, id))
      .returning()

    return deleted as Squad | null
  }
}

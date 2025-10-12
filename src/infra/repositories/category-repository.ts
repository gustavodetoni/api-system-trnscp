import { and, eq } from 'drizzle-orm'
import { Category } from '../../core/entities/category'
import { CategoryRepository } from '../../core/repositories/category-repository'
import { db } from '../database/drizzle'
import { categories } from '../database/schema'

export class DrizzleCategoryRepository implements CategoryRepository {
  async create(
    data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'>
  ): Promise<Category> {
    const [created] = await db.insert(categories).values(data).returning()
    return created as Category
  }

  async findById(id: string): Promise<Category | null> {
    const category = await db.query.categories.findFirst({
      where: (categories, { eq, and }) =>
        and(eq(categories.id, id), eq(categories.isDeleted, false)),
    })
    return (category as Category) || null
  }

  async findByNameAndSquadId(
    name: string,
    squadId: string
  ): Promise<Category | null> {
    const category = await db.query.categories.findFirst({
      where: (categories, { eq, and }) =>
        and(
          eq(categories.name, name),
          eq(categories.squadId, squadId),
          eq(categories.isDeleted, false)
        ),
    })
    return (category as Category) || null
  }

  async findBySquadId(squadId: string): Promise<Category[]> {
    const result = await db
      .select()
      .from(categories)
      .where(
        and(eq(categories.squadId, squadId), eq(categories.isDeleted, false))
      )

    return result as Category[]
  }

  async update(
    id: string,
    data: Partial<Omit<Category, 'id' | 'squadId'>>
  ): Promise<Category | null> {
    const [updated] = await db
      .update(categories)
      .set(data)
      .where(and(eq(categories.id, id), eq(categories.isDeleted, false)))
      .returning()

    return (updated as Category) || null
  }

  async delete(id: string): Promise<Category | null> {
    const [deleted] = await db
      .update(categories)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(categories.id, id))
      .returning()

    return (deleted as Category) || null
  }
}

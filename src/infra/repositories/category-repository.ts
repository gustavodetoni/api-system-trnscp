import { eq } from 'drizzle-orm'
import { Category } from '../../core/entities/category'
import { CategoryRepository } from '../../core/repositories/category-repository'
import { db } from '../database/drizzle'
import { categories } from '../database/schema'

export class DrizzleCategoryRepository implements CategoryRepository {
  async findBySquadId(squadId: string): Promise<Category[]> {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.squadId, squadId))

    return result as Category[]
  }
}

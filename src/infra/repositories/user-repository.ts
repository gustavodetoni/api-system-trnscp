import { eq, and } from 'drizzle-orm'
import { User } from '../../core/entities/user'
import { UserRepository } from '../../core/repositories/user-repository'
import { db } from '../database/drizzle'
import { users } from '../database/schema'

export class DrizzleUserRepository implements UserRepository {
  async create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<User> {
    const [created] = await db.insert(users).values(data).returning()
    return created as User
  }

  async findById(id: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: (users, { eq, and }) =>
        and(eq(users.id, id), eq(users.isDeleted, false)),
    })

    return user as User | null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: (users, { eq, and }) =>
        and(eq(users.email, email), eq(users.isDeleted, false)),
    })

    return user as User | null
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const [updated] = await db
      .update(users)
      .set(data)
      .where(and(eq(users.id, id), eq(users.isDeleted, false)))
      .returning()

    return updated as User | null
  }

  async delete(id: string): Promise<User | null> {
    const [deleted] = await db
      .update(users)
      .set({ isDeleted: true })
      .where(eq(users.id, id))
      .returning()

    return deleted as User | null
  }
}
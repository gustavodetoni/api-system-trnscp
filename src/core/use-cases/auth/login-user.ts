import { db } from '../../../infra/database/drizzle'
import { users } from '../../../infra/database/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { Unauthorized } from '../../../shared/errors/unauthorized'

export type LoginUserInput = {
  email: string
  password: string
}

export async function loginUser(input: LoginUserInput) {
  const [user] = await db
    .select({
      id: users.id,
      password: users.password,
      role: users.role,
      plan: users.plan,
      isDeleted: users.isDeleted,
      deletedAt: users.deletedAt,
    })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1)

  if (!user || user.isDeleted || user.deletedAt) {
    throw new Unauthorized('Invalid credentials')
  }

  const response = await bcrypt.compare(input.password, user.password)

  if (!response) throw new Unauthorized('Invalid password')

  return {
    id: user.id,
    role: user.role,
    plan: user.plan,
  }
}

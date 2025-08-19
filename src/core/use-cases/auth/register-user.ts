import { db } from '../../../infra/database/drizzle'
import { users } from '../../../infra/database/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { Conflict } from '../../../shared/errors/conflict'

export type RegisterUserInput = {
  name: string
  email: string
  password: string
}

export async function registerUser(input: RegisterUserInput) {
  const exists = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1)

  if (exists) throw new Conflict('Email already in use')

  const hash = await bcrypt.hash(input.password, 10)

  const [created] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      password: hash,
      role: 'VIEWER',
      plan: 'FREE',
    })
    .returning({ id: users.id, role: users.role, plan: users.plan })

  return created
}

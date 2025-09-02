import bcrypt from 'bcryptjs'
import { User } from '../../entities/user'
import { UserRepository } from '../../repositories/user-repository'
import { Conflict } from '../../../shared/errors/conflict'

type RegisterUserRequest = {
  name: string
  email: string
  password: string
  role?: 'VIEWER' | 'ADMIN' | 'ANALYST' | 'MEMBER' | 'SUPERVISOR'
  plan?: 'FREE' | 'PREMIUM' | 'CUSTOM'
}

type RegisterUserResponse = {
  id: string
  role: string
  plan: string
}

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    name,
    email,
    password,
    role = 'VIEWER',
    plan = 'FREE',
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const existingUser = await this.userRepository.findByEmail(email)

    if (existingUser) {
      throw new Conflict('Email already in use')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
      plan,
      isDeleted: false,
    })

    return {
      id: user.id,
      role: user.role,
      plan: user.plan,
    }
  }
}
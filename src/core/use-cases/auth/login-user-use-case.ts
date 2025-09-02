import bcrypt from 'bcryptjs'
import { UserRepository } from '../../repositories/user-repository'
import { Unauthorized } from '../../../shared/errors/unauthorized'

type LoginUserRequest = {
  email: string
  password: string
}

type LoginUserResponse = {
  id: string
  role: string
  plan: string
}

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: LoginUserRequest): Promise<LoginUserResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user || user.isDeleted || user.deletedAt) {
      throw new Unauthorized('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new Unauthorized('Invalid password')
    }

    return {
      id: user.id,
      role: user.role,
      plan: user.plan,
    }
  }
}
import { DrizzleUserRepository } from '../../../infra/repositories/user-repository'
import { RegisterUserUseCase } from './register-user-use-case'

export type RegisterUserInput = {
  name: string
  email: string
  password: string
}

const userRepository = new DrizzleUserRepository()
const registerUserUseCase = new RegisterUserUseCase(userRepository)

export async function registerUser(input: RegisterUserInput) {
  return await registerUserUseCase.execute(input)
}

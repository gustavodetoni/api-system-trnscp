import { DrizzleUserRepository } from '../../../infra/repositories/user-repository'
import { LoginUserUseCase } from './login-user-use-case'

export type LoginUserInput = {
  email: string
  password: string
}

const userRepository = new DrizzleUserRepository()
const loginUserUseCase = new LoginUserUseCase(userRepository)

export async function loginUser(input: LoginUserInput) {
  return await loginUserUseCase.execute(input)
}

import { AppError } from './app-error'

export class Unauthorized extends AppError {
  constructor(msg = 'Unauthorized') {
    super(msg, 401)
  }
}

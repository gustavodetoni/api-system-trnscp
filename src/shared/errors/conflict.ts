import { AppError } from './app-error'

export class Conflict extends AppError {
  constructor(msg = 'Conflict') {
    super(msg, 409)
  }
}

import { AppError } from './app-error'

export class Forbidden extends AppError {
  constructor(msg = 'Forbidden') {
    super(msg, 403)
  }
}

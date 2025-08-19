import { AppError } from "./app-error";

export class NotFound extends AppError {
  constructor(msg = 'Not Found') {
    super(msg, 404)
  }
}

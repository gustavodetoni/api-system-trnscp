export class AppError extends Error {
  status = 400
  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

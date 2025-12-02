export interface ValidationErrorDetail {
  field: string
  message: string
}

export class AppError extends Error {
  statusCode: number
  isOperational: boolean
  errors?: ValidationErrorDetail[]

  constructor(message: string, statusCode = 500, errors?: ValidationErrorDetail[], isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.errors = errors

    Error.captureStackTrace(this, this.constructor)
  }
}

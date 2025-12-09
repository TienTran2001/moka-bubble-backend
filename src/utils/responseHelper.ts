import { Response } from 'express'

interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: Array<{ field: string; message: string }>
}

export const sendResponse = {
  // Success responses
  success<T>(res: Response, data?: T, message: string = 'Success') {
    const response: ApiResponse<T> = { success: true, message, data }
    return res.status(200).json(response)
  },

  created<T>(res: Response, data?: T, message: string = 'Created successfully') {
    const response: ApiResponse<T> = { success: true, message, data }
    return res.status(201).json(response)
  },

  notFound(res: Response, message: string = 'Not found') {
    return this.error(res, message, 404)
  },

  // Error responses
  error(res: Response, message: string, statusCode: number = 400, errors?: Array<{ field: string; message: string }>) {
    const response: ApiResponse = { success: false, message, errors }
    return res.status(statusCode).json(response)
  },

  // Common status codes
  badRequest(res: Response, message: string = 'Bad request', errors?: any[]) {
    return this.error(res, message, 400, errors)
  },

  conflict(res: Response, message: string = 'Resource already exists') {
    return this.error(res, message, 409)
  },

  internalError(res: Response, message: string = 'Internal server error') {
    return this.error(res, message, 500)
  }
}

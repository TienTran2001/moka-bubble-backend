import { Request, Response, NextFunction } from 'express'
import { isHttpError } from 'http-errors'
import { AppError } from '~/errors/AppError'
import { sendResponse } from '~/utils/responseHelper'

export const errorHandler = (error: unknown, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error)
  }

  console.error('Error:', error)

  // Custom application error
  if (error instanceof AppError) {
    return sendResponse.error(res, error.message, error.statusCode, error.errors)
  }

  // http-errors instance
  if (isHttpError(error)) {
    return sendResponse.error(res, error.message, error.statusCode ?? 500)
  }

  const err = error as { code?: number; keyPattern?: Record<string, unknown>; message?: string }

  // MongoDB duplicate key error
  if (err && err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field'
    return sendResponse.error(res, `${field} already exists`, 409)
  }

  // Fallback 500
  const message = process.env.NODE_ENV === 'development' && err?.message ? err.message : 'Internal server error'
  return sendResponse.error(res, message, 500)
}

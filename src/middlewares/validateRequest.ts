import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { AppError, ValidationErrorDetail } from '~/errors/AppError'

type RequestPart = 'body' | 'query' | 'params'

export const validateRequest =
  (schema: ZodSchema, target: RequestPart = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target])

    if (!result.success) {
      const errors: ValidationErrorDetail[] = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }))

      throw new AppError('Validation failed', 400, errors)
    }

    next()
  }

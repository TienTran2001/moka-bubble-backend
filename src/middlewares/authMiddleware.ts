import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import envConfig from '~/config/env'
import { User } from '~/models'
import { IRequest } from '~/types/request'
import { sendResponse } from '~/utils/responseHelper'

interface IJwtPayload {
  userId: string
}

export const protectedRoute = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return sendResponse.error(res, "Don't have token", 403)
    }

    const decoded = jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET) as IJwtPayload

    const user = await User.findById(decoded.userId).select('-hashedPassword')

    if (!user) {
      return sendResponse.error(res, 'User not found', 404)
    }

    req.user = user
    next()
  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError) {
      return sendResponse.error(res, 'Invalid token', 403)
    }

    return next(error)
  }
}

import { NextFunction, Request, Response } from 'express'
import { sendResponse } from '~/utils/responseHelper'
import jwt from 'jsonwebtoken'
import envConfig from '~/config/env'
import { IUser, User } from '~/models'

interface IRequest extends Request {
  user?: IUser
}

interface IJwtPayload {
  userId: string
}

export const protectedRoute = async (req: IRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return sendResponse.error(res, "Don't have token", 401)
  }

  jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return sendResponse.error(res, 'Invalid token', 401)
    }
    const payload = decoded as IJwtPayload
    const user = await User.findById(payload.userId).select('-hashedPassword')
    if (!user) return sendResponse.error(res, 'User not found', 404)
    req.user = user
    next()
  })
}

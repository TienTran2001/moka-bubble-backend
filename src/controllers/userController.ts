import { Request, Response } from 'express'
import { IUser } from '~/models'
import { sendResponse } from '~/utils/responseHelper'

interface IRequest extends Request {
  user?: IUser
}

const authMe = (req: IRequest, res: Response) => {
  const user = req.user
  if (!user) return sendResponse.error(res, 'User not found', 404)

  return sendResponse.success(res, { me: user }, 'Get user information successfully')
}

export default {
  authMe
}

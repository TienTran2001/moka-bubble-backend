import { Request, Response } from 'express'
import { IRequest } from '~/types/request'
import { sendResponse } from '~/utils/responseHelper'

const authMe = (req: IRequest, res: Response) => {
  const user = req.user
  if (!user) return sendResponse.error(res, 'User not found', 404)

  return sendResponse.success(res, { me: user }, 'Get user information successfully')
}

const test = async (req: Request, res: Response) => {
  return res.sendStatus(204)
}

export default {
  authMe,
  test
}

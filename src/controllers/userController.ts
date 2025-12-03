import { Request, Response } from 'express'
import { sendResponse } from '~/utils/responseHelper'

const authMe = (req: Request, res: Response) => {
  return sendResponse.success(res, 'user')
}

export default {
  authMe
}

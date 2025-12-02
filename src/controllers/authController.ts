import { Request, Response } from 'express'
import { authService } from '~/services/authService'
import { sendResponse } from '~/utils/responseHelper'
import { SignUpInput } from '~/validations/authValidation'

export const signUp = async (req: Request, res: Response) => {
  const userData = req.body as SignUpInput

  const newUser = await authService.createUser(userData)

  return sendResponse.created(res, {
    id: newUser.id,
    username: newUser.username
  })
}

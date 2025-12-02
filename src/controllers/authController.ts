import { Request, Response } from 'express'
import envConfig from '~/config/env'
import { authService } from '~/services/authService'
import { sendResponse } from '~/utils/responseHelper'
import { SignUpInput, SignInInput } from '~/validations/authValidation'

export const signUp = async (req: Request, res: Response) => {
  const userData = req.body as SignUpInput

  const newUser = await authService.createUser(userData)

  return sendResponse.created(res, {
    id: newUser.id,
    username: newUser.username
  })
}

export const signIn = async (req: Request, res: Response) => {
  const credentials = req.body as SignInInput

  const { accessToken, refreshToken, displayName } = await authService.signIn(credentials)

  // save refresh token to cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // no access from javascript
    secure: true, // only send over https
    sameSite: 'none', // allow cross-site requests (frontend and backend deployed on different domains)
    maxAge: Number(envConfig.REFRESH_TOKEN_EXPIRES_IN) * 60 * 60 * 24 * 1000
  })

  return sendResponse.success(res, { accessToken }, `User ${displayName} signed in successfully`)
}

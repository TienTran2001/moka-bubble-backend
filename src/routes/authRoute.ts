import { Router } from 'express'
import authController from '~/controllers/authController'
import { validateRequest } from '~/middlewares/validateRequest'
import { signInSchema, signUpSchema } from '~/validations/authValidation'

const router = Router()

router.post('/sign-up', validateRequest(signUpSchema), authController.signUp)
router.post('/sign-in', validateRequest(signInSchema), authController.signIn)
router.post('/sign-out', authController.signOut)
router.post('/refresh', authController.refreshToken)

export default router

import { Router } from 'express'
import { signUp, signIn } from '~/controllers/authController'
import { validateRequest } from '~/middlewares/validateRequest'
import { signUpSchema, signInSchema } from '~/validations/authValidation'

const router = Router()

// Public routes
router.post('/sign-up', validateRequest(signUpSchema), signUp)
router.post('/sign-in', validateRequest(signInSchema), signIn)

export default router

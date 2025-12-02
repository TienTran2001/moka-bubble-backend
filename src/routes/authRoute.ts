import { Router } from 'express'
import authController from '~/controllers/authController'
import { validateRequest } from '~/middlewares/validateRequest'
import { signUpSchema, signInSchema } from '~/validations/authValidation'

const router = Router()

// Public routes
router.post('/sign-up', validateRequest(signUpSchema), authController.signUp)
router.post('/sign-in', validateRequest(signInSchema), authController.signIn)
router.post('/sign-out', authController.signOut)

export default router

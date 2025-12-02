import { Router } from 'express'
import { signUp } from '~/controllers/authController'
import { validateRequest } from '~/middlewares/validateRequest'
import { signUpSchema } from '~/validations/authValidation'

const router = Router()

// Public routes
router.post('/sign-up', validateRequest(signUpSchema), signUp)

export default router

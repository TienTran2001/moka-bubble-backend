import { Router } from 'express'
import userController from '~/controllers/userController'
import { protectedRoute } from '~/middlewares/authMiddleware'

const router = Router()

router.use(protectedRoute)
router.get('/me', userController.authMe)
router.get('/test', userController.test)

export default router

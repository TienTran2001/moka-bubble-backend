import { Router } from 'express'
import messageController from '~/controllers/messageController'
import { protectedRoute } from '~/middlewares/authMiddleware'

const router = Router()

router.use(protectedRoute)
router.post('/direct', messageController.sendDirectMessage)
router.post('/group', messageController.sendGroupMessage)

export default router

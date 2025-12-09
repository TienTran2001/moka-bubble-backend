import { Router } from 'express'
import friendController from '~/controllers/friendController'
import { protectedRoute } from '~/middlewares/authMiddleware'
import { validateRequest } from '~/middlewares/validateRequest'
import { sendFriendRequestSchema } from '~/validations/friendValidation'

const router = Router()

router.use(protectedRoute)
router.post('/requests', validateRequest(sendFriendRequestSchema), friendController.sendFriendRequest)
router.post('/requests/:requestId/accept', friendController.acceptFriendRequest)
router.post('/requests/:requestId/decline', friendController.declineFriendRequest)

router.get('/', friendController.getAllFriends)
router.get('/requests', friendController.getFriendRequests)

export default router

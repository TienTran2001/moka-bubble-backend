import { Router } from 'express'
import authRoute from '~/routes/authRoute'
import friendRoute from '~/routes/friendRoute'
import messageRoute from '~/routes/messageRoute'
import userRoute from '~/routes/userRoute'

const router = Router()

router.use('/auth', authRoute)

router.use('/users', userRoute)

router.use('/friends', friendRoute)

router.use('/messages', messageRoute)

export default router

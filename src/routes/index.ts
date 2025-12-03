import { Router } from 'express'
import userRoute from '~/routes/userRoute'
import authRoute from '~/routes/authRoute'

const router = Router()

router.use('/auth', authRoute)

router.use('/users', userRoute)

export default router

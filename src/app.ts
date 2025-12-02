// app.ts
import express from 'express'
import authRoute from '~/routes/authRoute'
import { errorHandler } from '~/middlewares/errorHandler'

const app = express()
app.use(express.json())

// Public routes
app.use('/api/auth', authRoute)

// Error handler
app.use(errorHandler)

export default app

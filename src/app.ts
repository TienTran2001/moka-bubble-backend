// app.ts
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { errorHandler } from '~/middlewares/errorHandler'
import router from '~/routes'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: true, credentials: true }))

app.use('/api', router)

// Error handler
app.use(errorHandler)

export default app

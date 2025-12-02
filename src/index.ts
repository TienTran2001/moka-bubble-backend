import express from 'express'
import { connectDB } from '~/libs/db'
import envConfig from '~/config/env'

const app = express()

const PORT = envConfig.PORT

// middleware
app.use(express.json())

// connect to database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})

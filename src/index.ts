import { connectDB } from '~/libs/db'
import envConfig from '~/config/env'
import app from './app'

const PORT = envConfig.PORT

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})

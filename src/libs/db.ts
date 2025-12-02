import mongoose from 'mongoose'
import envConfig from '~/config/env'

export const connectDB = async () => {
  try {
    await mongoose.connect(envConfig.MONGODB_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.log('Error connecting to MongoDB', error)
    process.exit(1)
  }
}

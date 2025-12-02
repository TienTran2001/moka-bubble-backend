import dotenv from 'dotenv'

// Load environment variables first
dotenv.config()

export const envConfig = {
  PORT: process.env.PORT || 5001,
  MONGODB_URI: process.env.MONGODB_URI!
}

export default envConfig

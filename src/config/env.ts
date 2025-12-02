import dotenv from 'dotenv'

// Load environment variables first
dotenv.config()

export const envConfig = {
  PORT: process.env.PORT || 5001,
  MONGODB_URI: process.env.MONGODB_URI!,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'access_token_secret',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'refresh_token_secret',
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN ?? 15,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN ?? 7
} as const

export default envConfig

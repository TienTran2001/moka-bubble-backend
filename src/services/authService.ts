import bcrypt from 'bcrypt'
import crypto from 'crypto'
import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import { envConfig } from '~/config/env'
import Session from '~/models/Session'
import User, { IUser } from '~/models/User'
import { SignInInput, SignUpInput } from '~/validations/authValidation'

// access token ttl in seconds
const ACCESS_TOKEN_TTL_SECONDS = Number(envConfig.ACCESS_TOKEN_EXPIRES_IN) * 60
// refresh token ttl in milliseconds
const REFRESH_TOKEN_TTL = Number(envConfig.REFRESH_TOKEN_EXPIRES_IN) * 60 * 60 * 24 * 1000

export const authService = {
  async createUser(userData: SignUpInput) {
    const { username, password, firstName, lastName, email, phone, bio } = userData

    const existingUser = await User.findOne({ username })

    if (existingUser) {
      throw createHttpError.Conflict('Username already exists')
    }

    const displayName = `${firstName} ${lastName}`.trim()

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      username: username.toLowerCase(),
      hashedPassword,
      displayName,
      email: email ? email.toLowerCase() : undefined,
      phone: phone || undefined,
      bio: bio || undefined
    })

    await newUser.save()

    return {
      id: newUser._id,
      username: newUser.username,
      displayName: newUser.displayName,
      email: newUser.email
    }
  },

  async signIn(credentials: SignInInput) {
    const { username, password } = credentials

    const user = await User.findOne({ username })

    if (!user) {
      throw createHttpError.Unauthorized('Invalid username or password')
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword)

    if (!isMatch) {
      throw createHttpError.Unauthorized('Invalid username or password')
    }

    // Create access token
    const accessToken = this.createAccessToken(user._id.toString())

    // Create refresh token (random string) and session
    const refreshToken = crypto.randomBytes(64).toString('hex')

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL)

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt
    })

    return {
      displayName: user.displayName,
      accessToken,
      refreshToken
    }
  },

  async signOut(refreshToken: string) {
    await Session.deleteOne({ refreshToken })
  },

  async findUser(filter: Partial<IUser>): Promise<IUser | null> {
    return User.findOne(filter as Record<string, unknown>)
  },

  createAccessToken(userId: string) {
    const accessToken = jwt.sign(
      {
        userId
      },
      envConfig.ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_TTL_SECONDS
      }
    )
    return accessToken
  },

  async refreshToken(refreshToken: string): Promise<string> {
    const existingToken = await Session.findOne({ refreshToken })

    if (!existingToken) {
      throw createHttpError.Unauthorized('Invalid refresh token')
    }

    const isExpired = existingToken.expiresAt.getTime() <= Date.now()

    if (isExpired) {
      await Session.deleteOne({ _id: existingToken._id })
      throw createHttpError.Unauthorized('Refresh token expired')
    }

    const newAccessToken = this.createAccessToken(existingToken.userId.toString())

    return newAccessToken
  }
}

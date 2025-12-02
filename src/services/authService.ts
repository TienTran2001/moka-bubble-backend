import bcrypt from 'bcrypt'
import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User, { IUser } from '~/models/User'
import Session from '~/models/Session'
import { envConfig } from '~/config/env'
import { SignUpInput, SignInInput } from '~/validations/authValidation'

const ACCESS_TOKEN_TTL = Number(envConfig.ACCESS_TOKEN_EXPIRES_IN) * 60 * 1000
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
    const accessToken = jwt.sign(
      {
        userId: user._id.toString()
      },
      envConfig.ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_TTL
      }
    )

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

  async findUser(filter: Partial<IUser>): Promise<IUser | null> {
    return User.findOne(filter as Record<string, unknown>)
  }
}

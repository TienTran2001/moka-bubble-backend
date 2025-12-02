import bcrypt from 'bcrypt'
import createHttpError from 'http-errors'
import User, { IUser } from '~/models/User'
import { SignUpInput } from '~/validations/authValidation'

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

  async findUser(filter: Partial<IUser>): Promise<IUser | null> {
    return User.findOne(filter as Record<string, unknown>)
  }
}

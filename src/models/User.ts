import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  username: string
  hashedPassword: string
  displayName: string
  email?: string
  avatarUrl?: string
  avatarId?: string
  bio?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Unique index for username
      trim: true,
      lowercase: true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    avatarUrl: {
      type: String // link CND for avatar display
    },
    avatarId: {
      type: String // id of avatar in cloudinary
    },
    bio: {
      type: String,
      maxLength: 500
    },
    phone: {
      type: String,
      sparse: true // allows null but not duplicate
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
)

// Index for better query performance
userSchema.index({ username: 1 })
userSchema.index({ email: 1 })

const User = mongoose.model<IUser>('User', userSchema)
export default User

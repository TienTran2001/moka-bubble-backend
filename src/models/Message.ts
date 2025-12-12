import mongoose from 'mongoose'

export interface IMessage {
  _id: mongoose.Types.ObjectId
  conversationId: mongoose.Types.ObjectId
  senderId: mongoose.Types.ObjectId
  content?: string | null
  imgUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      trim: true
    },
    imgUrl: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

messageSchema.index({ conversationId: 1, createdAt: -1 })

const Message = mongoose.model<IMessage>('Message', messageSchema)

export default Message

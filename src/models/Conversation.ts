import mongoose from 'mongoose'

export interface IParticipant {
  userId: mongoose.Types.ObjectId
  joinedAt: Date
}

export interface IGroup {
  name: string
  createdBy: mongoose.Types.ObjectId
}

export interface ILastMessage {
  _id: string
  content: string
  senderId: mongoose.Types.ObjectId
  createdAt: Date
}

export type ConversationType = 'direct' | 'group'
export type LastMessageType = 'text' | 'image' | 'audio' | 'video' | 'file'

export interface IConversation {
  _id: mongoose.Types.ObjectId
  type: ConversationType
  participants: IParticipant[]
  group: IGroup
  lastMessageAt: Date
  seenBy: mongoose.Types.ObjectId[]
  lastMessage: ILastMessage
  unreadCounts: Map<mongoose.Types.ObjectId, number>
}

export type ConversationDocument = mongoose.HydratedDocument<IConversation>

const participantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: false
  }
)

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    _id: false
  }
)

const lastMessageSchema = new mongoose.Schema(
  {
    _id: { type: String },
    content: { type: String, default: null },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: null
    }
  },
  {
    _id: false
  }
)

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['direct', 'group'],
      require: true
    },
    participants: {
      type: [participantSchema],
      require: true
    },
    group: {
      type: groupSchema
    },
    lastMessageAt: {
      type: Date
    },
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    lastMessage: {
      type: lastMessageSchema,
      default: null
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  {
    timestamps: true
  }
)

conversationSchema.index({ 'participants.userId': 1, lastMessageAt: -1 })
const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema)

export default Conversation

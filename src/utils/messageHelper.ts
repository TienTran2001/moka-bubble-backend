import mongoose from 'mongoose'
import { ConversationDocument } from '~/models/Conversation'
import { IMessage } from '~/models/Message'

export const updateConversationAfterCreateMessage = (
  conversation: ConversationDocument,
  message: IMessage,
  senderId: string | mongoose.Types.ObjectId
) => {
  conversation.set({
    seenBy: [],
    lastMessageAt: message.createdAt,
    lastMessage: {
      _id: message._id,
      content: message.content,
      senderId: message.senderId,
      createdAt: message.createdAt
    }
  })

  conversation.participants.forEach((p) => {
    const memberId = p.userId
    const isSender = memberId.toString() === senderId.toString()
    const prevCount = conversation.unreadCounts.get(memberId) || 0
    conversation.unreadCounts.set(memberId, isSender ? 0 : prevCount + 1)
  })
}

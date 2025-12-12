import createHttpError from 'http-errors'
import Conversation, { ConversationDocument } from '~/models/Conversation'
import Message from '~/models/Message'
import { updateConversationAfterCreateMessage } from '~/utils/messageHelper'

interface SendDirectMessageInput {
  recipientId: string
  conversationId?: string
  content: string
  senderId: string
}

const messageService = {
  sendDirectMessage: async ({ recipientId, conversationId, content, senderId }: SendDirectMessageInput) => {
    let conversation: ConversationDocument | null = null

    if (conversationId) {
      const found = await Conversation.findById(conversationId)

      if (found) {
        conversation = found as ConversationDocument
      }
    }

    if (!conversation) {
      conversation = new Conversation({
        type: 'direct',
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() }
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map()
      })
      await conversation.save()
    }

    if (!conversation) throw createHttpError.BadRequest('Conversation could not be initialized')

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content
    })

    updateConversationAfterCreateMessage(conversation, message, senderId)
    await conversation.save()
    return message
  }
}

export default messageService

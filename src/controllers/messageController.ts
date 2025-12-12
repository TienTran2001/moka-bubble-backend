import { Request, Response } from 'express'
import messageService from '~/services/messageService'
import { sendResponse } from '~/utils/responseHelper'

const sendDirectMessage = async (req: Request, res: Response) => {
  const { recipientId, content, conversationId } = req.body
  const senderId = req.user?._id.toString()

  if (!senderId) {
    return sendResponse.error(res, 'Unauthorized', 401)
  }

  if (!content) {
    return sendResponse.badRequest(res, 'Message content is required')
  }

  const message = await messageService.sendDirectMessage({ recipientId, conversationId, content, senderId })
  return sendResponse.success(res, message, 'Send message successfully')
}
const sendGroupMessage = async () => {}

export default {
  sendDirectMessage,
  sendGroupMessage
}

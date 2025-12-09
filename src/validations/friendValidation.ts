import { z } from 'zod'

export const sendFriendRequestSchema = z.object({
  to: z.string().min(1, 'To is required'),
  message: z.string().min(1, 'message is required').max(300, 'Message must be at most 300 characters')
})

export type SendFriendRequestInput = z.infer<typeof sendFriendRequestSchema>

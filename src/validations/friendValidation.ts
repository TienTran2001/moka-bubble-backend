import { z } from 'zod'

export const sendFriendRequestSchema = z.object({
  to: z.string().min(1, 'To is required'),
  message: z.string().max(300, 'Message must be at most 300 characters').optional()
})

export type SendFriendRequestInput = z.infer<typeof sendFriendRequestSchema>

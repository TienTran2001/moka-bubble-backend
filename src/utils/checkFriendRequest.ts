import createHttpError from 'http-errors'
import FriendRequest from '~/models/FriendRequest'

export const checkFriendRequest = async (requestId: string, userId?: string) => {
  const requestExisting = await FriendRequest.findById(requestId)

  if (!requestExisting) throw createHttpError.NotFound('Request not found')

  if (requestExisting.to.toString() !== userId)
    throw createHttpError.Forbidden('You are not authorized to accept this request')

  return requestExisting
}

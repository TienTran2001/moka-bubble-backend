import { Request, Response } from 'express'
import { friendService } from '~/services/friendService'
import { sendResponse } from '~/utils/responseHelper'

const sendFriendRequest = async (req: Request, res: Response) => {
  const { to, message } = req.body
  const from = req.user?._id?.toString()

  if (!from) return sendResponse.error(res, 'Unauthorized', 401)
  if (from === to) return sendResponse.badRequest(res, 'You cannot send friend request to yourself')

  const request = await friendService.sendFriendRequest({ from, to, message })
  return sendResponse.created(res, request, 'Friend request sent successfully')
}

const acceptFriendRequest = async (req: Request, res: Response) => {
  const { requestId } = req.params
  const userId = req.user?._id?.toString()

  const newFriend = await friendService.acceptFriendRequest({ requestId, userId })

  return sendResponse.success(res, newFriend, 'Friend request accepted successfully')
}

const declineFriendRequest = async (req: Request, res: Response) => {
  const { requestId } = req.params
  const userId = req.user?._id?.toString()
  await friendService.declineFriendRequest({ requestId, userId })
  return sendResponse.success(res, 'Friend request declined successfully')
}

const getFriendRequests = async (req: Request, res: Response) => {
  const userId = req.user?._id?.toString()
  if (!userId) {
    return sendResponse.error(res, 'Unauthorized', 401)
  }

  const requests = await friendService.getFriendRequests(userId)
  return sendResponse.success(res, requests, 'Friend requests fetched successfully')
}

const getAllFriends = async (req: Request, res: Response) => {
  const userId = req.user?._id?.toString()
  if (!userId) {
    return sendResponse.error(res, 'Unauthorized', 401)
  }

  const friends = await friendService.getAllFriends(userId)

  return sendResponse.success(res, friends, 'Friends fetched successfully')
}

export default {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequests,
  getAllFriends
}

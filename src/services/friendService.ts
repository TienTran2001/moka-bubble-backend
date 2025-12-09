import createHttpError from 'http-errors'
import { User } from '~/models'
import Friend from '~/models/Friend'
import FriendRequest from '~/models/FriendRequest'

interface SendFriendRequestInput {
  from: string
  to: string
  message?: string
}
interface AcceptFriendRequestInput {
  requestId: string
  userId?: string
}

interface DeclineFriendRequestInput {
  requestId: string
  userId?: string
}

export const friendService = {
  sendFriendRequest: async (data: SendFriendRequestInput) => {
    const { from, to, message } = data

    // 1. Check: user receiver exists
    const existingUser = await User.exists({ _id: to })
    if (!existingUser) {
      throw createHttpError.NotFound('User not found')
    }

    // 2. Normalize userA / userB
    let userA = from
    let userB = to
    if (userA > userB) [userA, userB] = [userB, userA]

    // 3. Check if already friends + Check if already have request
    const [alreadyFriends, existingRequest] = await Promise.all([
      Friend.findOne({ userA, userB }),
      FriendRequest.findOne({
        $or: [
          { from, to },
          { from: to, to: from }
        ]
      })
    ])

    if (alreadyFriends) {
      throw createHttpError.Conflict('You are already friends')
    }

    if (existingRequest) {
      throw createHttpError.Conflict('Friend request already sent')
    }

    // 4. Create new request
    const request = await FriendRequest.create({ from, to, message })
    return request
  },

  acceptFriendRequest: async ({ requestId, userId }: AcceptFriendRequestInput) => {
    // check request exists
    const requestExisting = await FriendRequest.findById(requestId)

    if (!requestExisting) throw createHttpError.NotFound('Request not found')

    // check if user is the receiver
    if (requestExisting.to.toString() !== userId)
      throw createHttpError.Forbidden('You are not authorized to accept this request')

    // create new friend
    const result = await Friend.create({
      userA: requestExisting.from,
      userB: requestExisting.to
    })

    if (result) {
      await FriendRequest.findByIdAndDelete(requestId)
    }

    const newFriend = await User.findById(requestExisting.from).select('_id displayName avatarUrl').lean()

    return newFriend
  },

  declineFriendRequest: async ({ requestId, userId }: DeclineFriendRequestInput) => {
    // check request exists
    const requestExisting = await FriendRequest.findById(requestId)

    if (!requestExisting) {
      throw createHttpError.NotFound('Request not found')
    }

    // check if user is the receiver
    if (requestExisting.to.toString() !== userId) {
      throw createHttpError.Forbidden('You are not authorized to decline this request')
    }

    // delete request
    await FriendRequest.findByIdAndDelete(requestId)
  }
}

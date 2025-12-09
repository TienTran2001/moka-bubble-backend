import createHttpError from 'http-errors'
import { User } from '~/models'
import Friend from '~/models/Friend'
import FriendRequest from '~/models/FriendRequest'
import { checkFriendRequest } from '~/utils/checkFriendRequest'

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
    const friendRequest = await checkFriendRequest(requestId, userId)
    const { from, to, _id } = friendRequest

    // Normalize userA / userB to maintain consistency
    let userA = from.toString()
    let userB = to.toString()
    if (userA > userB) [userA, userB] = [userB, userA]

    // create new friend
    const result = await Friend.create({
      userA,
      userB
    })

    if (result) {
      await FriendRequest.findByIdAndDelete(_id)
    }

    const newFriend = await User.findById(from).select('_id displayName avatarUrl').lean()

    return newFriend
  },

  declineFriendRequest: async ({ requestId, userId }: DeclineFriendRequestInput) => {
    const friendRequest = await checkFriendRequest(requestId, userId)
    const { _id } = friendRequest

    // delete request
    await FriendRequest.findByIdAndDelete(_id)
  }
}

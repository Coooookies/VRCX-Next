import { shallowRef, watchEffect } from 'vue'
import { useModule } from '@renderer/shared/hooks/use-module'
import { LocationInstanceUserType } from '@shared/definition/vrchat-instances'
import type { InstanceUserSummary } from '@shared/definition/vrchat-instances'
import type { VRChatFriends } from '@renderer/shared/modules/vrchat-friends'
import type { VRChatInstances } from '@renderer/shared/modules/vrchat-instances'

export interface InstancePlayer extends InstanceUserSummary {
  isFriend: boolean
  isOwner: boolean
}

export function useCurrentInstance() {
  const { friends } = useModule<VRChatFriends>('VRChatFriends')
  const { state, currentInstanceUsers } = useModule<VRChatInstances>('VRChatInstances')
  const instancePlayers = shallowRef<InstancePlayer[]>([])

  watchEffect(() => {
    instancePlayers.value = currentInstanceUsers.value.map((user) => {
      const location = state.currentInstance.location
      const isFriend = friends.value.findIndex((f) => f.userId === user.userId) !== -1
      const isOwner =
        (location?.type === LocationInstanceUserType.Friends ||
          location?.type === LocationInstanceUserType.FriendsPlus ||
          location?.type === LocationInstanceUserType.Invite ||
          location?.type === LocationInstanceUserType.InvitePlus) &&
        location?.userId === user.userId

      return {
        ...user,
        isFriend,
        isOwner
      }
    })
  })

  return {
    instancePlayers
  }
}

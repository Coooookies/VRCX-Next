import { computed, shallowRef, watchEffect } from 'vue'
import { useModule } from '@renderer/shared/hooks/use-module'
import { LocationInstanceUserType } from '@shared/definition/vrchat-instances'
import type { InstanceUserSummary } from '@shared/definition/vrchat-instances'
import type { ServiceMonitor } from '@renderer/shared/modules/service-monitor'
import type { VRChatFriends } from '@renderer/shared/modules/vrchat-friends'
import type { VRChatInstances } from '@renderer/shared/modules/vrchat-instances'

export interface InstancePlayer extends InstanceUserSummary {
  isFriend: boolean
  isOwner: boolean
}

export function useCurrentInstance() {
  const { friends } = useModule<VRChatFriends>('VRChatFriends')
  const service = useModule<ServiceMonitor>('ServiceMonitor')
  const instance = useModule<VRChatInstances>('VRChatInstances')
  const instancePlayers = shallowRef<InstancePlayer[]>([])
  const instanceEvents = instance.currentInstanceEvents

  const isJoined = computed(() => instance.state.currentInstance.joined)
  const isGameRunning = computed(() => service.state.vrchat.isRunning)
  const isInstanceLoading = computed(() => {
    return service.state.vrchat.isRunning
      ? instance.state.currentInstance.locationPlayersInitializing
      : false
  })

  watchEffect(() => {
    instancePlayers.value = instance.currentInstanceUsers.value.map((user) => {
      const location = instance.state.currentInstance.locationInstance
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
    instancePlayers,
    instanceEvents,
    isGameRunning,
    isInstanceLoading,
    isJoined,
    service: service.state,
    instance: instance.state
  }
}

import { computed, shallowRef, watchEffect } from 'vue'
import { useModule } from '@renderer/shared/hooks/use-module'
import { LocationInstanceUserType } from '@shared/definition/vrchat-instances'
import type { InstanceUserWithInformation } from '@shared/definition/vrchat-instances'
import type { ServiceMonitor } from '@renderer/shared/modules/service-monitor'
import type { VRChatFriends } from '@renderer/shared/modules/vrchat-friends'
import type { VRChatInstances } from '@renderer/shared/modules/vrchat-instances'

export interface InstancePlayer extends InstanceUserWithInformation {
  isFriend: boolean
  isOwner: boolean
}

export function useCurrentInstance() {
  const { friends } = useModule<VRChatFriends>('VRChatFriends')
  const service = useModule<ServiceMonitor>('ServiceMonitor')
  const instance = useModule<VRChatInstances>('VRChatInstances')
  const instancePlayers = shallowRef<InstancePlayer[]>([])
  const instanceEvents = instance.currentInstanceEvents

  const isJoined = computed(() => instance.trackerState.isJoined)
  const isInInstance = computed(() => instance.trackerState.isInInstance)
  const isInitializing = computed(() => instance.trackerState.isInitializing)
  const isGameRunning = computed(() => service.state.vrchat.isRunning)

  watchEffect(() => {
    instancePlayers.value = instance.currentInstancePlayers.value.map((user) => {
      const location = instance.trackerState.locationInstance
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
    isJoined,
    isInInstance,
    isInitializing,
    service: service.state,
    instance: instance.trackerState
  }
}

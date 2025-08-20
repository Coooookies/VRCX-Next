import { computed, ref } from 'vue'
import { capitalize } from 'lodash'
import { useModule } from '@renderer/shared/hooks/use-module'
import { AnnoyedIcon, LaughIcon, MapPinHouseIcon, SmileIcon } from 'lucide-vue-next'
import { Platform, UserStatus } from '@shared/definition/vrchat-api-response'
import {
  LocationInstanceGroupType,
  LocationInstancePublicType,
  LocationInstanceUserType
} from '@shared/definition/vrchat-instances'
import type { VRChatFriends } from '@renderer/shared/modules/vrchat-friends'
import type { FriendInformation } from '@shared/definition/vrchat-friends'
import type { FunctionalComponent } from 'vue'
import type { LocationInstance } from '@shared/definition/vrchat-instances'
export interface GroupedFriends {
  online: FriendInformation[]
  webActive: FriendInformation[]
  offline: FriendInformation[]
}

export interface LocationGroup {
  location: LocationInstance
  friends: FriendInformation[]
}

export interface VirtualFriendHeader {
  id: string
  type: 'header'
  icon: FunctionalComponent
  label: string
}

export interface VirtualFriendItem {
  id: string
  groupId: string
  type: 'item'
  item: FriendInformation
}

export type VirtualFriend = VirtualFriendHeader | VirtualFriendItem

function groupFriends(friends: FriendInformation[]): GroupedFriends {
  const result: GroupedFriends = {
    online: [],
    webActive: [],
    offline: []
  }

  for (const friend of friends) {
    if (friend.status === UserStatus.Offline) {
      result.offline.push(friend)
    } else {
      if (friend.platform === Platform.Web) {
        result.webActive.push(friend)
      } else {
        result.online.push(friend)
      }
    }
  }

  return result
}

function groupFriendsByLocation(friends: FriendInformation[]): LocationGroup[] {
  const result = new Map<string, { location: LocationInstance; friends: FriendInformation[] }>()

  for (const friend of friends) {
    const location = friend.location
    if (!location) {
      continue
    }

    const key = `${location.worldId}::${location.name}`
    let group = result.get(key)
    if (!group) {
      group = { location: location, friends: [] }
      result.set(key, group)
    }

    group.friends.push(friend)
  }

  return [...result.values()].filter((g) => g.friends.length > 1)
}

function sortFriends(friends: FriendInformation[]): FriendInformation[] {
  const priority: Record<UserStatus, number> = {
    [UserStatus.JoinMe]: 0,
    [UserStatus.Active]: 1,
    [UserStatus.AskMe]: 2,
    [UserStatus.Busy]: 3,
    [UserStatus.Offline]: 4
  }

  return friends.sort((a, b) => {
    const statusDiff = priority[a.status] - priority[b.status]
    return statusDiff !== 0
      ? statusDiff
      : a.displayName.localeCompare(b.displayName, undefined, { sensitivity: 'base' })
  })
}

function wrapFriendInformation(groupId: string, friends: FriendInformation[]): VirtualFriendItem[] {
  return friends.map((friend, index) => ({
    id: `${groupId}-item-${index}`,
    groupId,
    type: 'item',
    item: friend
  }))
}

function wrapGroupedFriends(
  id: string,
  name: string,
  icon: FunctionalComponent,
  friends: FriendInformation[],
  isLoading: boolean,
  isCollapsed: boolean
): VirtualFriend[] {
  return friends.length > 0
    ? [
        {
          id,
          type: 'header',
          icon,
          label: isLoading ? name : `${name} (${friends.length})`
        },
        ...(!isCollapsed ? wrapFriendInformation(id, sortFriends(friends)) : [])
      ]
    : []
}

export function getLocationLabel(location: LocationInstance) {
  switch (location.type) {
    case LocationInstanceGroupType.Group:
    case LocationInstanceGroupType.GroupPlus:
    case LocationInstanceGroupType.GroupPublic: {
      const baseText = `${location.worldName} #${location.name} ${capitalize(location.type)}(${location.groupName})`
      return location.require18yo ? `${baseText} 18+` : baseText
    }
    case LocationInstancePublicType.Public:
    case LocationInstanceUserType.Friends:
    case LocationInstanceUserType.FriendsPlus:
    case LocationInstanceUserType.Invite:
    case LocationInstanceUserType.InvitePlus:
    default: {
      return `${location.worldName} #${location.name} ${capitalize(location.type)}`
    }
  }
}

export function useSidebarFriends() {
  const friends = useModule<VRChatFriends>('VRChatFriends')
  const searchModelValue = ref('')
  const collapsedGroupId = ref<string[]>([])

  const filteredFriends = computed(() => {
    const searchTerm = searchModelValue.value.toLowerCase().trim()

    if (!searchTerm) {
      return friends.friends.value
    }

    return friends.friends.value.filter(
      (friend) =>
        friend.displayName.toLowerCase().includes(searchTerm) ||
        friend.statusDescription?.toLowerCase().includes(searchTerm) ||
        friend.location?.worldName?.toLowerCase().includes(searchTerm)
    )
  })

  const sameLocationFriends = computed(() => groupFriendsByLocation(filteredFriends.value))
  const groupedFriends = computed(() => groupFriends(filteredFriends.value))
  const virtualFriends = computed((): VirtualFriend[] => {
    const onlineGroupId = 'online-group'
    const onlineFriends = wrapGroupedFriends(
      onlineGroupId,
      'Online',
      LaughIcon,
      groupedFriends.value.online,
      friends.state.loading,
      isCollapsed(onlineGroupId)
    )

    const webActiveGroupId = 'web-active-group'
    const webActiveFriends = wrapGroupedFriends(
      webActiveGroupId,
      'Web Active',
      SmileIcon,
      groupedFriends.value.webActive,
      friends.state.loading,
      isCollapsed(webActiveGroupId)
    )

    const offlineGroupId = 'offline-group'
    const offlineFriends = wrapGroupedFriends(
      offlineGroupId,
      'Offline',
      AnnoyedIcon,
      groupedFriends.value.offline,
      friends.state.loading,
      isCollapsed(offlineGroupId)
    )

    const sameLocationGroupedFriends = sameLocationFriends.value.reduce<VirtualFriend[]>(
      (arr, curr) => {
        const groupId = `location-group-${curr.location.worldId}-${curr.location.name}`
        return arr.concat(
          wrapGroupedFriends(
            groupId,
            getLocationLabel(curr.location),
            MapPinHouseIcon,
            curr.friends,
            friends.state.loading,
            isCollapsed(groupId)
          )
        )
      },
      []
    )

    return [...sameLocationGroupedFriends, ...onlineFriends, ...webActiveFriends, ...offlineFriends]
  })

  function isCollapsed(groupId: string) {
    return collapsedGroupId.value.includes(groupId)
  }

  function toggleCollapse(groupId: string) {
    if (collapsedGroupId.value.includes(groupId)) {
      collapsedGroupId.value = collapsedGroupId.value.filter((id) => id !== groupId)
    } else {
      collapsedGroupId.value.push(groupId)
    }
  }

  return {
    virtualFriends,
    groupedFriends,
    sameLocationFriends,
    filteredFriends,
    searchModelValue,
    toggleCollapse
  }
}

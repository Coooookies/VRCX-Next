import { computed, ref, watch } from 'vue'
import { useI18n } from '@renderer/shared/locale'
import { useModule } from '@renderer/shared/hooks/use-module'
import { AnnoyedIcon, LaughIcon, MapPinHouseIcon, SmileIcon } from 'lucide-vue-next'
import { Platform, UserStatus } from '@shared/definition/vrchat-api-response'
import {
  LocationInstanceGroupType,
  LocationInstancePublicType,
  LocationInstanceUserType
} from '@shared/definition/vrchat-instances'
import {
  LOCATION_TYPE_TRANSLATE_KEY,
  STATUS_PRIORITY
} from '@renderer/shared/constants/locate-mapping'
import type { VRChatFriends } from '@renderer/shared/modules/vrchat-friends'
import type { FriendInformation } from '@shared/definition/vrchat-friends'
import type { FunctionalComponent } from 'vue'
import type { LocationInstance } from '@shared/definition/vrchat-instances'

const GROUP_CONFIG = {
  online: { id: 'online-group', name: 'Online', icon: LaughIcon },
  webActive: { id: 'web-active-group', name: 'Web Active', icon: SmileIcon },
  offline: { id: 'offline-group', name: 'Offline', icon: AnnoyedIcon }
} as const

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
  collapsed: boolean
  label: string
}

export interface VirtualFriendItem {
  id: string
  groupId: string
  type: 'item'
  mode: 'normal' | 'timer'
  item: FriendInformation
}

export type VirtualFriend = VirtualFriendHeader | VirtualFriendItem

function groupFriends(friends: FriendInformation[]): GroupedFriends {
  return friends.reduce<GroupedFriends>(
    (acc, friend) => {
      if (friend.status === UserStatus.Offline) {
        acc.offline.push(friend)
      } else if (friend.platform === Platform.Web) {
        acc.webActive.push(friend)
      } else {
        acc.online.push(friend)
      }
      return acc
    },
    { online: [], webActive: [], offline: [] }
  )
}

function groupFriendsByLocation(friends: FriendInformation[]): LocationGroup[] {
  const locationMap = new Map<string, LocationGroup>()

  for (const friend of friends) {
    if (!friend.location) continue

    const key = `${friend.location.worldId}::${friend.location.name}`
    const existingGroup = locationMap.get(key)

    if (existingGroup) {
      existingGroup.friends.push(friend)
    } else {
      locationMap.set(key, {
        location: friend.location,
        friends: [friend]
      })
    }
  }

  return [...locationMap.values()].filter((group) => group.friends.length > 1)
}

function sortFriends(friends: FriendInformation[]): FriendInformation[] {
  return friends.sort((a, b) => {
    const statusDiff = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]
    return statusDiff !== 0
      ? statusDiff
      : a.displayName.localeCompare(b.displayName, undefined, { sensitivity: 'base' })
  })
}

function wrapFriendInformation(
  groupId: string,
  mode: VirtualFriendItem['mode'],
  friends: FriendInformation[]
): VirtualFriendItem[] {
  return friends.map((friend) => ({
    id: `${groupId}-item-${friend.userId}`,
    groupId,
    mode,
    type: 'item' as const,
    item: friend
  }))
}

function wrapGroupedFriends(
  id: string,
  name: string,
  icon: FunctionalComponent,
  friends: FriendInformation[],
  mode: VirtualFriendItem['mode'],
  isLoading: boolean,
  isCollapsed: boolean
): VirtualFriend[] {
  if (friends.length === 0) return []

  const header: VirtualFriendHeader = {
    id,
    type: 'header' as const,
    icon,
    collapsed: isCollapsed,
    label: isLoading ? name : `${name} (${friends.length})`
  }

  const sortedFriends = sortFriends(friends)
  const filteredFriends = isCollapsed ? [] : wrapFriendInformation(id, mode, sortedFriends)
  return [header, ...filteredFriends]
}

export function getLocationLabel(location: LocationInstance, includeWorldName: boolean = true) {
  const { t } = useI18n()
  const translatedTypeName = t(LOCATION_TYPE_TRANSLATE_KEY[location.type])

  switch (location.type) {
    case LocationInstanceGroupType.Group:
    case LocationInstanceGroupType.GroupPlus:
    case LocationInstanceGroupType.GroupPublic: {
      const baseText = `${includeWorldName ? `${location.worldName} ` : ''}#${location.name} ${translatedTypeName}(${location.groupName})`
      return location.require18yo ? `${baseText} 18+` : baseText
    }
    case LocationInstancePublicType.Public:
    case LocationInstanceUserType.Friends:
    case LocationInstanceUserType.FriendsPlus:
    case LocationInstanceUserType.Invite:
    case LocationInstanceUserType.InvitePlus:
    default: {
      return `${includeWorldName ? `${location.worldName} ` : ''}#${location.name} ${translatedTypeName}`
    }
  }
}

export function useSidebarFriends() {
  const friends = useModule<VRChatFriends>('VRChatFriends')
  const searchModelValue = ref('')
  const collapsedGroupId = ref(new Set<string>())
  const isLoading = computed(() => friends.state.loading)

  const filteredFriends = computed(() => {
    const searchTerm = searchModelValue.value.toLowerCase().trim()

    if (!searchTerm) {
      return friends.friends.value
    }

    return friends.friends.value.filter((friend) => {
      const displayName = friend.displayName.toLowerCase()
      const statusDescription = friend.statusDescription?.toLowerCase() || ''
      const worldName = friend.location?.worldName?.toLowerCase() || ''

      return (
        displayName.includes(searchTerm) ||
        statusDescription.includes(searchTerm) ||
        worldName.includes(searchTerm)
      )
    })
  })

  const sameLocationFriends = computed(() => groupFriendsByLocation(filteredFriends.value))
  const groupedFriends = computed(() => groupFriends(filteredFriends.value))

  const virtualFriends = computed((): VirtualFriend[] => {
    const { online, webActive, offline } = GROUP_CONFIG
    const isLoading = friends.state.loading

    const onlineFriends = wrapGroupedFriends(
      online.id,
      online.name,
      online.icon,
      groupedFriends.value.online,
      'normal',
      isLoading,
      isCollapsed(online.id)
    )

    const webActiveFriends = wrapGroupedFriends(
      webActive.id,
      webActive.name,
      webActive.icon,
      groupedFriends.value.webActive,
      'normal',
      isLoading,
      isCollapsed(webActive.id)
    )

    const offlineFriends = wrapGroupedFriends(
      offline.id,
      offline.name,
      offline.icon,
      groupedFriends.value.offline,
      'normal',
      isLoading,
      isCollapsed(offline.id)
    )

    const sameLocationGroupedFriends = sameLocationFriends.value.flatMap((curr) => {
      const groupId = `location-group-${curr.location.worldId}-${curr.location.name}`
      return wrapGroupedFriends(
        groupId,
        getLocationLabel(curr.location),
        MapPinHouseIcon,
        curr.friends,
        'timer',
        isLoading,
        isCollapsed(groupId)
      )
    })

    return [...sameLocationGroupedFriends, ...onlineFriends, ...webActiveFriends, ...offlineFriends]
  })

  watch(
    friends.friends,
    () => {
      const availableGroupIds = new Set(
        virtualFriends.value.filter((item) => item.type === 'header').map((item) => item.id)
      )

      // Keep only group IDs that still exist
      collapsedGroupId.value = new Set(
        [...collapsedGroupId.value].filter((id) => availableGroupIds.has(id))
      )
    },
    { deep: true }
  )

  function isCollapsed(groupId: string): boolean {
    return collapsedGroupId.value.has(groupId)
  }

  function toggleCollapse(groupId: string): void {
    if (collapsedGroupId.value.has(groupId)) {
      collapsedGroupId.value.delete(groupId)
    } else {
      collapsedGroupId.value.add(groupId)
    }
    // Trigger reactivity
    collapsedGroupId.value = new Set(collapsedGroupId.value)
  }

  return {
    virtualFriends,
    groupedFriends,
    sameLocationFriends,
    filteredFriends,
    searchModelValue,
    isLoading,
    toggleCollapse
  }
}

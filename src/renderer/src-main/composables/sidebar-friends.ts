import { computed, ref, watch } from 'vue'
import { useModule } from '@renderer/shared/hooks/use-module'
import { AnnoyedIcon, LaughIcon, MapPinHouseIcon, SmileIcon } from 'lucide-vue-next'
import { Platform, UserStatus } from '@shared/definition/vrchat-api-response'
import {
  LocationInstanceGroupType,
  LocationInstancePublicType,
  LocationInstanceUserType
} from '@shared/definition/vrchat-instances'
import { STATUS_PRIORITY } from '@renderer/shared/constants/profile-mapping'
import { LOCATION_TYPE_TRANSLATE_KEY } from '@renderer/shared/constants/instance-mapping'
import type { VRChatFriends } from '@renderer/shared/modules/vrchat-friends'
import type { FriendInformation } from '@shared/definition/vrchat-friends'
import type { FunctionalComponent } from 'vue'
import type { LocationInstanceSummary } from '@shared/definition/vrchat-instances'
import type { LocaleI18NKeys } from '@renderer/shared/locale/types'
import type { TranslationFunction } from '@renderer/shared/locale'

export interface GroupedFriends {
  online: FriendInformation[]
  webActive: FriendInformation[]
  offline: FriendInformation[]
}

export interface LocationGroup {
  location: LocationInstanceSummary
  friends: FriendInformation[]
}

export interface VirtualFriendHeader {
  id: string
  type: 'header'
  icon: FunctionalComponent
  collapsed: boolean
  label: (t: TranslationFunction) => string
}

export interface VirtualFriendItem {
  id: string
  groupId: string
  type: 'item'
  mode: 'normal' | 'timer'
  item: FriendInformation
}

const statusGroupDefinition = {
  online: {
    id: 'online-group',
    translateKey: 'sidebar.friends_group_name.online',
    icon: LaughIcon
  },
  webActive: {
    id: 'web-active-group',
    translateKey: 'sidebar.friends_group_name.web_active',
    icon: SmileIcon
  },
  offline: {
    id: 'offline-group',
    translateKey: 'sidebar.friends_group_name.offline',
    icon: AnnoyedIcon
  }
} as const

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
  translateKey: LocaleI18NKeys,
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
    label: (t) => (isLoading ? t(translateKey) : `${t(translateKey)} (${friends.length})`)
  }

  const sortedFriends = sortFriends(friends)
  const filteredFriends = !isCollapsed ? wrapFriendInformation(id, mode, sortedFriends) : []
  return [header, ...filteredFriends]
}

export function getLocationLabel(
  location: LocationInstanceSummary,
  includeWorldName: boolean = true
) {
  switch (location.type) {
    case LocationInstanceGroupType.Group:
    case LocationInstanceGroupType.GroupPlus:
    case LocationInstanceGroupType.GroupPublic: {
      return (t: TranslationFunction) => {
        const baseText = `${includeWorldName ? `${location.worldName} ` : ''}#${location.name} ${t(LOCATION_TYPE_TRANSLATE_KEY[location.type])}(${location.groupName})`
        return location.require18yo ? `${baseText} 18+` : baseText
      }
    }
    case LocationInstancePublicType.Public:
    case LocationInstanceUserType.Friends:
    case LocationInstanceUserType.FriendsPlus:
    case LocationInstanceUserType.Invite:
    case LocationInstanceUserType.InvitePlus:
    default: {
      return (t: TranslationFunction) =>
        `${includeWorldName ? `${location.worldName} ` : ''}#${location.name} ${t(LOCATION_TYPE_TRANSLATE_KEY[location.type])}`
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
    const isLoading = friends.state.loading
    const { online, offline, webActive } = statusGroupDefinition

    const onlineFriends = wrapGroupedFriends(
      online.id,
      online.translateKey,
      online.icon,
      groupedFriends.value.online,
      'normal',
      isLoading,
      isCollapsed(online.id)
    )

    const webActiveFriends = wrapGroupedFriends(
      webActive.id,
      webActive.translateKey,
      webActive.icon,
      groupedFriends.value.webActive,
      'normal',
      isLoading,
      isCollapsed(webActive.id)
    )

    const offlineFriends = wrapGroupedFriends(
      offline.id,
      offline.translateKey,
      offline.icon,
      groupedFriends.value.offline,
      'normal',
      isLoading,
      isCollapsed(offline.id)
    )

    const sameLocationGroupedFriends = sameLocationFriends.value.flatMap((curr) => {
      const groupId = `location-group-${curr.location.worldId}-${curr.location.name}`
      const collapsed = isCollapsed(groupId)
      const label = getLocationLabel(curr.location)
      const header: VirtualFriendHeader = {
        id: groupId,
        type: 'header',
        icon: MapPinHouseIcon,
        collapsed: isCollapsed(groupId),
        label: (t) => (isLoading ? label(t) : `${label(t)} (${curr.friends.length})`)
      }

      const sortedFriends = sortFriends(curr.friends)
      const filteredFriends = !collapsed
        ? wrapFriendInformation(groupId, 'timer', sortedFriends)
        : []

      return [header, ...filteredFriends]
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

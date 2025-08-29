import { computed } from 'vue'
import { useModule } from '@renderer/shared/hooks/use-module'
import {
  NotificationGlobalCategory,
  NotificationGlobalType,
  NotificationInformation
} from '@shared/definition/vrchat-notifications'
import type { VRChatNotifications } from '@renderer/shared/modules/vrchat-notifications'
import type { TranslationFunction } from '@renderer/shared/locale'

interface NotificationCollection {
  label: (t: TranslationFunction) => string
  unreadCount: number
  notifications: NotificationInformation[]
}

export type NotificationCollections = Record<NotificationGlobalCategory, NotificationCollection>

const categoryType: Record<NotificationGlobalType, NotificationGlobalCategory> = {
  [NotificationGlobalType.InviteV1]: NotificationGlobalCategory.Friends,
  [NotificationGlobalType.InviteResponseV1]: NotificationGlobalCategory.Friends,
  [NotificationGlobalType.RequestInviteV1]: NotificationGlobalCategory.Friends,
  [NotificationGlobalType.RequestInviteResponseV1]: NotificationGlobalCategory.Friends,
  [NotificationGlobalType.VotetokickV1]: NotificationGlobalCategory.Others,
  [NotificationGlobalType.FriendRequestV1]: NotificationGlobalCategory.Friends,
  [NotificationGlobalType.MessageV1]: NotificationGlobalCategory.Others,
  [NotificationGlobalType.UnknownV1]: NotificationGlobalCategory.Others,
  [NotificationGlobalType.GroupAnnouncementV2]: NotificationGlobalCategory.Groups,
  [NotificationGlobalType.GroupInviteV2]: NotificationGlobalCategory.Groups,
  [NotificationGlobalType.GroupInformativeV2]: NotificationGlobalCategory.Groups,
  [NotificationGlobalType.GroupJoinRequestV2]: NotificationGlobalCategory.Groups,
  [NotificationGlobalType.GroupTransferV2]: NotificationGlobalCategory.Groups,
  [NotificationGlobalType.GroupQueueReadyV2]: NotificationGlobalCategory.Groups,
  [NotificationGlobalType.EventAnnouncementV2]: NotificationGlobalCategory.Others,
  [NotificationGlobalType.UnknownV2]: NotificationGlobalCategory.Others
}

function filterNotificationsByCategory(
  notifications: NotificationInformation[],
  category: NotificationGlobalCategory
): NotificationInformation[] {
  return notifications.filter((notification) => categoryType[notification.type] === category)
}

export function useSidebarNotifications() {
  const notifications = useModule<VRChatNotifications>('VRChatNotifications')
  const isLoading = computed(() => notifications.state.loading)
  const isUnread = computed(() =>
    notifications.notifications.value.some((notification) => !notification.isRead)
  )

  const sortedNotifications = computed(() => {
    return [...notifications.notifications.value].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )
  })

  const categories = computed(() => {
    const friends = filterNotificationsByCategory(
      sortedNotifications.value,
      NotificationGlobalCategory.Friends
    )

    const groups = filterNotificationsByCategory(
      sortedNotifications.value,
      NotificationGlobalCategory.Groups
    )

    const others = filterNotificationsByCategory(
      sortedNotifications.value,
      NotificationGlobalCategory.Others
    )

    const result: NotificationCollections = {
      [NotificationGlobalCategory.Friends]: {
        label: (t) => t('sidebar.notifications_category.friends'),
        unreadCount: friends.filter((n) => !n.isRead).length,
        notifications: friends
      },
      [NotificationGlobalCategory.Groups]: {
        label: (t) => t('sidebar.notifications_category.groups'),
        unreadCount: groups.filter((n) => !n.isRead).length,
        notifications: groups
      },
      [NotificationGlobalCategory.Others]: {
        label: (t) => t('sidebar.notifications_category.others'),
        unreadCount: others.filter((n) => !n.isRead).length,
        notifications: others
      }
    }

    return result
  })

  return {
    categories,
    isLoading,
    isUnread
  }
}

<script setup lang="ts">
import ScrollContainer from '@renderer/shared/components/scroll-container.vue'
import NotificationPopoverEmpty from '../notification/notification-popover-empty.vue'
import NotificationPopoverLoading from '../notification/notification-popover-loading.vue'
import NotificationPopoverV1Invite from '../notification/notification-popover-v1-invite.vue'
import NotificationPopoverV1RequestInviteResponse from '../notification/notification-popover-v1-request-invite-response.vue'
import NotificationPopoverV1InviteResponse from '../notification/notification-popover-v1-invite-response.vue'
import NotificationPopoverV1RequestInvite from '../notification/notification-popover-v1-request-invite.vue'
import NotificationPopoverV1FriendRequest from '../notification/notification-popover-v1-friend-request.vue'
import NotificationPopoverV1VoteToKick from '../notification/notification-popover-v1-vote-to-kick.vue'
import NotificationPopoverV1Message from '../notification/notification-popover-v1-message.vue'
import NotificationPopoverV1Unknown from '../notification/notification-popover-v1-unknown.vue'
import NotificationPopoverV2GroupAnnouncement from '../notification/notification-popover-v2-group-announcement.vue'
import NotificationPopoverV2GroupInformative from '../notification/notification-popover-v2-group-informative.vue'
import NotificationPopoverV2GroupInvite from '../notification/notification-popover-v2-group-invite.vue'
import NotificationPopoverV2GroupJoinRequest from '../notification/notification-popover-v2-group-join-request.vue'
import NotificationPopoverV2GroupQueueReady from '../notification/notification-popover-v2-group-queue-ready.vue'
import NotificationPopoverV2GroupTransfer from '../notification/notification-popover-v2-group-transfer.vue'
import NotificationPopoverV2EventAnnouncement from '../notification/notification-popover-v2-event-announcement.vue'
import NotificationPopoverV2BadgeEarned from '../notification/notification-popover-v2-badge-earned.vue'
import NotificationPopoverV2Unknown from '../notification/notification-popover-v2-unknown.vue'
import { cn } from '@renderer/shared/utils/style'
import { computed, ref, shallowReadonly } from 'vue'
import { useI18n } from '@renderer/shared/locale'
import { Badge } from '@renderer/shared/components/ui/badge'
import { Button } from '@renderer/shared/components/ui/button'
import { PopoverContent } from '@renderer/shared/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/shared/components/ui/tabs'
import { NotificationGlobalType } from '@shared/definition/vrchat-notifications'
import type { Component } from 'vue'
import type { NotificationV2ResponseType } from '@shared/definition/vrchat-api-response'
import type { NotificationCollections } from '@renderer/src-main/composables/sidebar-notifications'
import type { NotificationGlobalCategory } from '@shared/definition/vrchat-notifications'

const { t } = useI18n()

const props = defineProps<{
  categories: NotificationCollections
  isSupporter: boolean
  isLoading: boolean
  acceptFriendRequest: (notificationId: string) => Promise<void>
  declineFriendRequest: (notificationId: string) => Promise<void>
  respondNotificationV2: (
    notificationId: string,
    type: NotificationV2ResponseType,
    data: string
  ) => Promise<void>
  acceptInvite: (notificationId: string) => Promise<void>
  respondInvite: (notificationId: string) => Promise<void>
  respondInviteWithMessage: (notificationId: string) => Promise<void>
  respondInviteWithPhoto: (notificationId: string) => Promise<void>
}>()

const emits = defineEmits<{
  (e: 'showAllNotifications'): void
  (e: 'showUser', userId: string): void
  (e: 'showGroup', groupId: string): void
  (e: 'showInstance', instanceId: string): void
  (e: 'showVoteToKickDetails', notificationId: string): void
  (e: 'searchGroupByName', name: string): void
  (e: 'searchUserByName', name: string): void
  (e: 'hideNotificationV1', notificationId: string): void
  (e: 'hideNotificationV2', notificationId: string): void
  (e: 'readNotificationV1', notificationId: string): void
  (e: 'readNotificationV2', notificationId: string): void
}>()

const notificationComponents = shallowReadonly({
  [NotificationGlobalType.InviteV1]: NotificationPopoverV1Invite,
  [NotificationGlobalType.RequestInviteV1]: NotificationPopoverV1RequestInvite,
  [NotificationGlobalType.InviteResponseV1]: NotificationPopoverV1InviteResponse,
  [NotificationGlobalType.RequestInviteResponseV1]: NotificationPopoverV1RequestInviteResponse,
  [NotificationGlobalType.FriendRequestV1]: NotificationPopoverV1FriendRequest,
  [NotificationGlobalType.VotetokickV1]: NotificationPopoverV1VoteToKick,
  [NotificationGlobalType.MessageV1]: NotificationPopoverV1Message,
  [NotificationGlobalType.UnknownV1]: NotificationPopoverV1Unknown,
  [NotificationGlobalType.GroupAnnouncementV2]: NotificationPopoverV2GroupAnnouncement,
  [NotificationGlobalType.GroupInformativeV2]: NotificationPopoverV2GroupInformative,
  [NotificationGlobalType.GroupInviteV2]: NotificationPopoverV2GroupInvite,
  [NotificationGlobalType.GroupJoinRequestV2]: NotificationPopoverV2GroupJoinRequest,
  [NotificationGlobalType.GroupQueueReadyV2]: NotificationPopoverV2GroupQueueReady,
  [NotificationGlobalType.GroupTransferV2]: NotificationPopoverV2GroupTransfer,
  [NotificationGlobalType.EventAnnouncementV2]: NotificationPopoverV2EventAnnouncement,
  [NotificationGlobalType.BadgeEarnedV2]: NotificationPopoverV2BadgeEarned,
  [NotificationGlobalType.UnknownV2]: NotificationPopoverV2Unknown
} as const satisfies Record<NotificationGlobalType, Component>)

const getNotificationComponent = (type: NotificationGlobalType): Component => {
  return notificationComponents[type] ?? NotificationPopoverV1Unknown
}

const tabIndex = ref<NotificationGlobalCategory>('friends')

const tabs = computed(() => {
  return Object.entries(props.categories).map(([key, value]) => ({
    key: key as NotificationGlobalCategory,
    ...value
  }))
})
</script>

<template>
  <PopoverContent
    :align="'start'"
    :align-offset="-32"
    :side-offset="24"
    side="left"
    update-position-strategy="optimized"
    disable-update-on-layout-shift
    class="relative w-94 p-0 rounded-lg overflow-hidden"
  >
    <div class="flex flex-row pt-4 px-5 pb-1.5">
      <h2 class="flex-1 text-base font-semibold">{{ t('sidebar.notifications_title') }}</h2>
    </div>
    <Tabs v-model="tabIndex" class="w-full h-146.5 items-center gap-0">
      <TabsList
        :class="
          cn('w-full h-auto rounded-none border-b bg-transparent justify-start', 'pl-2.5 pr-5 py-0')
        "
      >
        <TabsTrigger
          v-for="tab in tabs"
          :key="tab.key"
          :value="tab.key"
          :class="
            cn(
              'h-10 gap-1.5 relative rounded-none px-2.5 py-2 after:absolute data-[state=active]:bg-transparent data-[state=active]:shadow-none',
              'after:bg-primary after:inset-x-2.5 after:bottom-0 after:h-0.5',
              'after:scale-x-50 data-[state=active]:after:scale-x-100 after:opacity-0 data-[state=active]:after:opacity-100',
              'after:transition-[scale,opacity] after:duration-150 after:ease-in-out'
            )
          "
        >
          <span class="text-[13px]">{{ tab.label(t) }}</span>
          <Badge
            v-if="tab.unreadCount > 0"
            class="size-4 text-[10px] transition-opacity group-data-[state=inactive]:bg-primary/15"
          >
            {{ tab.unreadCount }}
          </Badge>
        </TabsTrigger>
        <Button
          class="px-0 py-2 ml-auto"
          variant="link"
          size="sm"
          @click="emits('showAllNotifications')"
        >
          <span class="text-[13px]">{{ t('notification.show_all_notification') }}</span>
        </Button>
      </TabsList>
      <TabsContent
        v-for="tab in tabs"
        :key="tab.key"
        :value="tab.key"
        class="relative w-full flex-1 h-0"
      >
        <ScrollContainer v-if="tab.notifications.length > 0" class="size-full">
          <template v-for="notification in tab.notifications" :key="notification.notificationId">
            <component
              :is="getNotificationComponent(notification.type)"
              v-bind="{
                base: notification,
                raw: notification.raw,
                isSupporter,
                acceptFriendRequest: props.acceptFriendRequest,
                declineFriendRequest: props.declineFriendRequest,
                respondNotificationV2: props.respondNotificationV2,
                acceptInvite: props.acceptInvite,
                respondInvite: props.respondInvite,
                respondInviteWithMessage: props.respondInviteWithMessage,
                respondInviteWithPhoto: props.respondInviteWithPhoto
              }"
              v-on="{
                showUser: (userId) => emits('showUser', userId),
                showGroup: (groupId) => emits('showGroup', groupId),
                showInstance: (location) => emits('showInstance', location),
                searchGroupByName: (userName) => emits('searchGroupByName', userName),
                searchUserByName: (groupName) => emits('searchUserByName', groupName),
                showVoteToKickDetails: (notificationId) =>
                  emits('showVoteToKickDetails', notificationId),
                hideNotificationV1: (notificationId) => emits('hideNotificationV1', notificationId),
                hideNotificationV2: (notificationId) => emits('hideNotificationV2', notificationId),
                readNotificationV1: (notificationId) => emits('readNotificationV1', notificationId),
                readNotificationV2: (notificationId) => emits('readNotificationV2', notificationId)
              }"
            />
          </template>
        </ScrollContainer>
        <NotificationPopoverLoading v-else-if="props.isLoading" class="size-full" />
        <NotificationPopoverEmpty v-else class="size-full" />
      </TabsContent>
    </Tabs>
  </PopoverContent>
</template>

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
import { cn } from '@renderer/shared/utils/style'
import { computed, ref } from 'vue'
import { useI18n } from '@renderer/shared/locale'
import { Badge } from '@renderer/shared/components/ui/badge'
import { PopoverContent } from '@renderer/shared/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/shared/components/ui/tabs'
import { NotificationGlobalType } from '@shared/definition/vrchat-notifications'
import type { NotificationCollections } from '@renderer/src-main/composables/sidebar-notifications'
import type { NotificationGlobalCategory } from '@shared/definition/vrchat-notifications'
import NotificationPopoverV2GroupAnnouncement from '../notification/notification-popover-v2-group-announcement.vue'
import NotificationPopoverV2EventAnnouncement from '../notification/notification-popover-v2-event-announcement.vue'

const { t } = useI18n()

const props = defineProps<{
  categories: NotificationCollections
  isLoading?: boolean
}>()

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
    <div class="pt-4 px-5 pb-1.5">
      <h2 class="text-base font-semibold">{{ t('sidebar.notifications_title') }}</h2>
    </div>
    <Tabs v-model="tabIndex" class="w-full h-146.5 items-center gap-0">
      <TabsList
        :class="
          cn(
            'w-full h-auto rounded-none border-b bg-transparent justify-start gap-4.5',
            'px-5 py-0'
          )
        "
      >
        <TabsTrigger
          v-for="tab in tabs"
          :key="tab.key"
          :value="tab.key"
          class="h-10 gap-1.5 data-[state=active]:after:bg-primary relative rounded-none px-0 py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <span class="text-[13px]">{{ tab.label(t) }}</span>
          <Badge
            v-if="tab.unreadCount > 0"
            class="size-4 text-[10px] transition-opacity group-data-[state=inactive]:bg-primary/15"
          >
            {{ tab.unreadCount }}
          </Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent
        v-for="tab in tabs"
        :key="tab.key"
        :value="tab.key"
        class="relative w-full flex-1 h-0"
      >
        <ScrollContainer v-if="tab.notifications.length > 0" class="w-full h-full">
          <template v-for="notification in tab.notifications" :key="notification.notificationId">
            <NotificationPopoverV1Invite
              v-if="notification.type === NotificationGlobalType.InviteV1"
              :base="notification"
              :raw="notification.raw"
            />
            <NotificationPopoverV1RequestInvite
              v-else-if="notification.type === NotificationGlobalType.RequestInviteV1"
              :base="notification"
              :raw="notification.raw"
            />
            <NotificationPopoverV1InviteResponse
              v-else-if="notification.type === NotificationGlobalType.InviteResponseV1"
              :base="notification"
              :raw="notification.raw"
            />
            <NotificationPopoverV1RequestInviteResponse
              v-else-if="notification.type === NotificationGlobalType.RequestInviteResponseV1"
              :base="notification"
              :raw="notification.raw"
            />
            <NotificationPopoverV1FriendRequest
              v-else-if="notification.type === NotificationGlobalType.FriendRequestV1"
              :base="notification"
              :raw="notification.raw"
            />
            <NotificationPopoverV1VoteToKick
              v-else-if="notification.type === NotificationGlobalType.VotetokickV1"
              :base="notification"
              :raw="notification.raw"
            />
            <NotificationPopoverV1Message
              v-else-if="notification.type === NotificationGlobalType.MessageV1"
              :base="notification"
              :raw="notification.raw"
            />
            <NotificationPopoverV1Unknown
              v-else-if="notification.type === NotificationGlobalType.UnknownV1"
              :base="notification"
              :raw="notification.raw"
            />
            <NotificationPopoverV2GroupAnnouncement
              v-else-if="notification.type === NotificationGlobalType.GroupAnnouncementV2"
              :base="notification"
              :raw="notification.raw"
            />
            <NotificationPopoverV2EventAnnouncement
              v-else-if="notification.type === NotificationGlobalType.EventAnnouncementV2"
              :base="notification"
              :raw="notification.raw"
            />
          </template>
        </ScrollContainer>
        <NotificationPopoverLoading v-else-if="props.isLoading" class="w-full h-full" />
        <NotificationPopoverEmpty v-else class="w-full h-full" />
      </TabsContent>
    </Tabs>
  </PopoverContent>
</template>

<script setup lang="ts">
import { useI18n } from '@renderer/shared/locale'
import { computed, ref } from 'vue'
import { Badge } from '@renderer/shared/components/ui/badge'
import { PopoverContent } from '@renderer/shared/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/shared/components/ui/tabs'
import type { NotificationCollections } from '@renderer/src-main/composables/sidebar-notifications'
import {
  NotificationGlobalType,
  type NotificationGlobalCategory
} from '@shared/definition/vrchat-notifications'
import ScrollContainer from '@renderer/shared/components/scroll-container.vue'
import NotificationEmpty from '../notification/notification-empty.vue'
import NotificationLoading from '../notification/notification-loading.vue'
import NotificationV1Invite from '../notification/notification-v1-invite.vue'
import NotificationV1RequestInviteResponse from '../notification/notification-v1-request-invite-response.vue'
import NotificationV1InviteResponse from '../notification/notification-v1-invite-response.vue'
import NotificationV1RequestInvite from '../notification/notification-v1-request-invite.vue'
import NotificationV1FriendRequest from '../notification/notification-v1-friend-request.vue'

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
        class="w-full h-auto rounded-none border-b bg-transparent justify-start gap-4.5 px-5 py-0"
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
            <NotificationV1Invite
              v-if="notification.type === NotificationGlobalType.InviteV1"
              :base="notification"
              :raw="notification.raw"
            />
            <NotificationV1RequestInvite
              v-else-if="notification.type === NotificationGlobalType.RequestInviteV1"
              :base="notification"
              :raw="notification.raw"
            />
            <NotificationV1InviteResponse
              v-else-if="notification.type === NotificationGlobalType.InviteResponseV1"
              :base="notification"
              :raw="notification.raw"
            />
            <NotificationV1RequestInviteResponse
              v-else-if="notification.type === NotificationGlobalType.RequestInviteResponseV1"
              :base="notification"
              :raw="notification.raw"
            />
            <NotificationV1FriendRequest
              v-else-if="notification.type === NotificationGlobalType.FriendRequestV1"
              :base="notification"
              :raw="notification.raw"
            />
          </template>
        </ScrollContainer>
        <NotificationLoading v-else-if="props.isLoading" class="w-full h-full" />
        <NotificationEmpty v-else class="w-full h-full" />
      </TabsContent>
    </Tabs>
  </PopoverContent>
</template>

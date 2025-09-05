<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import { computed } from 'vue'
import { useI18n } from '@renderer/shared/locale'
import { useAsyncState } from '@vueuse/core'
import {
  NotificationGlobalType,
  NotificationSenderType
} from '@shared/definition/vrchat-notifications'
import { Button } from '@renderer/shared/components/ui/button'
import { Spinner } from '@renderer/shared/components/ui/spinner'
import type { NotificationBaseProps } from './types'
import type { NotificationGlobalRawInformation } from '@shared/definition/vrchat-notifications'
import NotificationPopoverAvatar from './notification-popover-avatar.vue'
import NotificationPopoverMessageTitle from './notification-popover-message-title.vue'
import NotificationPopoverActionButton from './notification-popover-action-button.vue'
import NotificationPopoverSubtitle from './notification-popover-subtitle.vue'

const { t } = useI18n()

const props = defineProps<{
  base: NotificationBaseProps
  raw: NotificationGlobalRawInformation[typeof NotificationGlobalType.FriendRequestV1]
  acceptFriendRequest: (notificationId: string) => Promise<void>
  declineFriendRequest: (notificationId: string) => Promise<void>
}>()

const emits = defineEmits<{
  (e: 'hideNotificationV1', notificationId: string): void
  (e: 'readNotificationV1', notificationId: string): void
  (e: 'showUser', userId: string): void
}>()

const { executeImmediate: acceptRequest, isLoading: accepting } = useAsyncState(
  props.acceptFriendRequest,
  void 0,
  {
    immediate: false
  }
)

const { executeImmediate: declineRequest, isLoading: declining } = useAsyncState(
  props.declineFriendRequest,
  void 0,
  {
    immediate: false
  }
)

const isLoading = computed(() => accepting.value || declining.value)

const handleFocusNotification = () => {
  if (!props.base.isRead) {
    emits('readNotificationV1', props.base.notificationId)
  }
}

const handleShowSender = () => {
  if (props.base.senderId) {
    emits('showUser', props.base.senderId)
  }
}
</script>

<template>
  <Button
    :class="
      cn(
        'group/notification-card',
        'w-full h-[unset] px-5 py-4 cursor-default rounded-none',
        'active:bg-accent dark:active:bg-accent/50 duration-0',
        'border-b border-border/40',
        'flex flex-col items-start gap-2.5',
        props.base.isRead ? 'bg-transparent' : 'bg-accent/20 dark:bg-accent/30'
      )
    "
    variant="ghost"
    @click="handleFocusNotification"
  >
    <div class="w-full h-10 flex flex-row items-center justify-start gap-4">
      <NotificationPopoverAvatar
        :file-id="props.base.senderAvatarFileId"
        :version="props.base.senderAvatarFileVersion"
        :type="NotificationSenderType.User"
      />
      <div class="grid flex-1 text-left text-sm leading-tight gap-y-0.5">
        <NotificationPopoverMessageTitle
          :sender-name="props.base.senderName"
          :description="t('notification.content.friend_request')"
          @show-sender="handleShowSender"
          @hide-notification="emits('hideNotificationV1', props.base.notificationId)"
        />
        <NotificationPopoverSubtitle :created-at="props.base.createdAt" />
      </div>
    </div>
    <div class="flex flex-row items-center justify-start gap-1.5 pl-14 pb-0.5">
      <div v-if="isLoading" class="h-6 flex items-center justify-center">
        <Spinner class="size-5" />
      </div>
      <template v-else>
        <NotificationPopoverActionButton
          variant="default"
          :description="t('notification.response.friend_request_accept')"
          @click="acceptRequest(props.base.notificationId)"
        />
        <NotificationPopoverActionButton
          variant="secondary"
          :description="t('notification.response.friend_request_decline')"
          @click="declineRequest(props.base.notificationId)"
        />
      </template>
    </div>
  </Button>
</template>

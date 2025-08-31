<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import { useI18n } from '@renderer/shared/locale'
import {
  NotificationGlobalType,
  NotificationSenderType
} from '@shared/definition/vrchat-notifications'
import { Button } from '@renderer/shared/components/ui/button'
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
}>()

const emits = defineEmits<{
  (e: 'hideNotification'): void
  (e: 'readNotification'): void
  (e: 'showSender'): void
  (e: 'acceptRequest'): void
  (e: 'declineRequest'): void
}>()

const handleFocusNotification = () => {
  if (!props.base.isRead) {
    emits('readNotification')
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
          @show-sender="emits('showSender')"
          @hide-notification="emits('hideNotification')"
        />
        <NotificationPopoverSubtitle :created-at="props.base.createdAt" />
      </div>
    </div>
    <div class="flex flex-row items-center justify-start gap-1.5 pl-14 pb-0.5">
      <NotificationPopoverActionButton
        variant="default"
        :description="t('notification.content.friend_accept')"
        @click="emits('acceptRequest')"
      />
      <NotificationPopoverActionButton
        variant="secondary"
        :description="t('notification.content.friend_decline')"
        @click="emits('declineRequest')"
      />
    </div>
  </Button>
</template>

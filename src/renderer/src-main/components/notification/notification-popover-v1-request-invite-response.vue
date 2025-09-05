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
import NotificationPopoverContent from './notification-popover-content.vue'
import NotificationPopoverSubtitle from './notification-popover-subtitle.vue'

const { t } = useI18n()

const props = defineProps<{
  base: NotificationBaseProps
  raw: NotificationGlobalRawInformation[typeof NotificationGlobalType.RequestInviteResponseV1]
}>()

const emits = defineEmits<{
  (e: 'hideNotificationV1', notificationId: string): void
  (e: 'readNotificationV1', notificationId: string): void
  (e: 'showUser', userrId: string): void
}>()

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
          :description="t('notification.content.instance_request_invite_response')"
          @show-sender="handleShowSender"
          @hide-notification="emits('hideNotificationV1', props.base.notificationId)"
        />
        <NotificationPopoverSubtitle :created-at="props.base.createdAt" />
      </div>
    </div>
    <NotificationPopoverContent
      :message-content="props.raw.details.requestMessage"
      message-italic
    />
  </Button>
</template>

<script setup lang="ts">
import {
  NotificationGlobalType,
  NotificationSenderType
} from '@shared/definition/vrchat-notifications'
import type { NotificationBaseProps } from './types'
import type { NotificationGlobalRawInformation } from '@shared/definition/vrchat-notifications'
import type { NotificationV2ResponseType } from '@shared/definition/vrchat-api-response'
import NotificationPopoverMessageTitle from './notification-popover-message-title.vue'
import NotificationPopoverSubtitle from './notification-popover-subtitle.vue'
import NotificationPopoverV2Base from './notification-popover-v2-base.vue'

const props = defineProps<{
  base: NotificationBaseProps
  raw: NotificationGlobalRawInformation[typeof NotificationGlobalType.UnknownV2]
  respondNotificationV2: (
    notificationId: string,
    type: NotificationV2ResponseType,
    data: string
  ) => Promise<void>
}>()

const emits = defineEmits<{
  (e: 'hideNotificationV2', notificationId: string): void
  (e: 'readNotificationV2', notificationId: string): void
  (e: 'showUser', userrId: string): void
  (e: 'showGroup', groupId: string): void
}>()

const handleShowSender = () => {
  if (!props.base.senderId) {
    return
  }

  switch (props.base.senderType) {
    case NotificationSenderType.User:
      emits('showUser', props.base.senderId)
      break
    case NotificationSenderType.Group:
      emits('showGroup', props.base.senderId)
      break
    default:
      break
  }
}
</script>

<template>
  <NotificationPopoverV2Base
    :base="props.base"
    :raw="props.raw"
    :type="NotificationSenderType.System"
    :respond-notification-v2="props.respondNotificationV2"
    @read-notification-v2="emits('readNotificationV2', props.base.notificationId)"
  >
    <NotificationPopoverMessageTitle
      :sender-name="props.base.senderName"
      :description="props.base.title"
      @show-sender="handleShowSender"
      @hide-notification="emits('hideNotificationV2', props.base.notificationId)"
    />
    <NotificationPopoverSubtitle :created-at="props.base.createdAt" />
  </NotificationPopoverV2Base>
</template>

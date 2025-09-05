<script setup lang="ts">
import { useI18n } from '@renderer/shared/locale'
import {
  NotificationGlobalType,
  NotificationSenderType
} from '@shared/definition/vrchat-notifications'
import type { NotificationBaseProps } from './types'
import type { NotificationGlobalRawInformation } from '@shared/definition/vrchat-notifications'
import type { NotificationV2ResponseType } from '@shared/definition/vrchat-api-response'
import NotificationPopoverSubtitle from './notification-popover-subtitle.vue'
import NotificationPopoverV2Base from './notification-popover-v2-base.vue'
import NotificationPopoverInviteGroupTitle from './notification-popover-invite-group-title.vue'

const { t } = useI18n()

const props = defineProps<{
  base: NotificationBaseProps
  raw: NotificationGlobalRawInformation[typeof NotificationGlobalType.GroupInviteV2]
  respondNotificationV2: (
    notificationId: string,
    type: NotificationV2ResponseType,
    data: string
  ) => Promise<void>
}>()

const emits = defineEmits<{
  (e: 'hideNotificationV2', notificationId: string): void
  (e: 'readNotificationV2', notificationId: string): void
  (e: 'searchUserByName', userName: string): void
  (e: 'searchGroupByName', groupName: string): void
}>()
</script>

<template>
  <NotificationPopoverV2Base
    :base="props.base"
    :raw="props.raw"
    :type="NotificationSenderType.Group"
    :respond-notification-v2="props.respondNotificationV2"
    @read-notification-v2="emits('readNotificationV2', props.base.notificationId)"
  >
    <NotificationPopoverInviteGroupTitle
      :user-name="props.raw.data.managerUserDisplayName"
      :group-name="props.raw.data.groupName"
      :description="t('notification.content.group_invite')"
      @search-group-by-name="emits('searchGroupByName', props.raw.data.groupName)"
      @search-user-by-name="emits('searchUserByName', props.raw.data.managerUserDisplayName)"
      @hide-notification="emits('hideNotificationV2', props.base.notificationId)"
    />
    <NotificationPopoverSubtitle :created-at="props.base.createdAt" />
  </NotificationPopoverV2Base>
</template>

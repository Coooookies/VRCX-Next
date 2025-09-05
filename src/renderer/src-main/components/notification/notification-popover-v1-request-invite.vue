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
import NotificationPopoverContent from './notification-popover-content.vue'
import NotificationPopoverActionButton from './notification-popover-action-button.vue'
import NotificationPopoverInviteDeclineOption from './notification-popover-invite-decline-option.vue'
import NotificationPopoverSubtitle from './notification-popover-subtitle.vue'

const { t } = useI18n()

const props = defineProps<{
  base: NotificationBaseProps
  raw: NotificationGlobalRawInformation[typeof NotificationGlobalType.RequestInviteV1]
  isSupporter: boolean
  respondInvite: (notificationId: string) => Promise<void>
  respondInviteWithMessage: (notificationId: string) => Promise<void>
  respondInviteWithPhoto: (notificationId: string) => Promise<void>
}>()

const emits = defineEmits<{
  (e: 'hideNotificationV1', notificationId: string): void
  (e: 'readNotificationV1', notificationId: string): void
  (e: 'showUser', userrId: string): void
  (e: 'showInstance', instanceId: string): void
}>()

const { executeImmediate: respondInvite, isLoading: responsingInvite } = useAsyncState(
  props.respondInvite,
  void 0,
  { immediate: false }
)

const { executeImmediate: respondInviteWithMessage, isLoading: responsingInviteWithMessage } =
  useAsyncState(props.respondInviteWithMessage, void 0, { immediate: false })

const { executeImmediate: respondInviteWithPhoto, isLoading: responsingInviteWithPhoto } =
  useAsyncState(props.respondInviteWithPhoto, void 0, { immediate: false })

const isLoading = computed(
  () =>
    responsingInvite.value || responsingInviteWithMessage.value || responsingInviteWithPhoto.value
)

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
          :description="t('notification.content.instance_request_invite')"
          @show-sender="handleShowSender"
          @hide-notification="emits('hideNotificationV1', props.base.notificationId)"
        />
        <NotificationPopoverSubtitle :created-at="props.base.createdAt" />
      </div>
    </div>
    <NotificationPopoverContent
      :message-thumbnail-url="props.raw.details.imageUrl"
      :message-content="props.raw.details.requestMessage"
      message-italic
    />
    <div class="flex flex-row items-center justify-start gap-1.5 pl-14 pb-0.5">
      <div v-if="isLoading" class="h-6 flex items-center justify-center">
        <Spinner class="size-5" />
      </div>
      <div v-else class="flex flex-row gap-px">
        <NotificationPopoverActionButton
          class="rounded-r-none rounded-l-sm"
          variant="secondary"
          :description="t('notification.response.instance_invite_decline')"
          @click.stop="respondInvite(props.base.notificationId)"
        />
        <NotificationPopoverInviteDeclineOption
          :decline-with-message-title="
            t('notification.response.instance_request_invite_decline_with_message')
          "
          :decline-with-photo-title="
            t('notification.response.instance_request_invite_decline_with_photo')
          "
          :is-supporter="props.isSupporter"
          @respond-invite-with-message="respondInviteWithMessage(props.base.notificationId)"
          @respond-invite-with-photo="respondInviteWithPhoto(props.base.notificationId)"
        />
      </div>
    </div>
  </Button>
</template>

<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import {
  NotificationGlobalType,
  NotificationSenderType
} from '@shared/definition/vrchat-notifications'
import { Button } from '@renderer/shared/components/ui/button'
import { RelativeTimerText } from '@renderer/shared/components/timer'
import type { NotificationBaseProps } from './types'
import type { NotificationGlobalRawInformation } from '@shared/definition/vrchat-notifications'
import NotificationPopoverAvatar from './notification-popover-avatar.vue'
import NotificationPopoverInviteInstanceTitle from './notification-popover-invite-instance-title.vue'
import NotificationPopoverContent from './notification-popover-content.vue'
import NotificationPopoverActionButton from './notification-popover-action-button.vue'
import NotificationPopoverInviteDeclineOption from './notification-popover-invite-decline-option.vue'

const props = defineProps<{
  base: NotificationBaseProps
  raw: NotificationGlobalRawInformation[typeof NotificationGlobalType.InviteV1]
  isSupporter: boolean
}>()

const emits = defineEmits<{
  (e: 'hideNotification'): void
  (e: 'readNotification'): void
  (e: 'showSender'): void
  (e: 'showInstance'): void
  (e: 'respondInvite'): void
  (e: 'respondInviteWithMessage'): void
  (e: 'respondInviteWithPhoto'): void
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
        <NotificationPopoverInviteInstanceTitle
          :sender-name="props.base.senderName"
          :world-name="props.raw.details.worldName"
          description="invite you to"
          @show-sender="emits('showSender')"
          @show-instance="emits('showInstance')"
          @hide-notification="emits('hideNotification')"
        />
        <p class="text-xs text-muted-foreground capitalize truncate">
          <RelativeTimerText :start-time="props.base.createdAt" />
        </p>
      </div>
    </div>
    <NotificationPopoverContent
      :message-thumbnail-url="props.raw.details.imageUrl"
      :message-content="props.raw.details.inviteMessage"
      message-italic
    />
    <div class="flex flex-row items-center justify-start gap-1.5 pl-14 pb-0.5">
      <div class="flex flex-row gap-px">
        <NotificationPopoverActionButton
          class="rounded-r-none rounded-l-sm"
          variant="secondary"
          description="Decline"
          @click="emits('respondInvite')"
        />
        <NotificationPopoverInviteDeclineOption
          decline-with-message-title="Decline with message"
          decline-with-photo-title="Decline with Photo"
          :is-supporter="props.isSupporter"
          @respond-invite-with-message="emits('respondInviteWithMessage')"
          @respond-invite-with-photo="emits('respondInviteWithPhoto')"
        />
      </div>
    </div>
  </Button>
</template>

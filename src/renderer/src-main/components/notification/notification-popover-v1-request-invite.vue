<script setup lang="ts">
import ImageVrchatContext from '@renderer/shared/components/image-vrchat-context.vue'
import { cn } from '@renderer/shared/utils/style'
import { RelativeTimerText } from '@renderer/shared/components/timer'
import { NotificationGlobalType } from '@shared/definition/vrchat-notifications'
import { ImageFallback, ImageRoot } from '@renderer/shared/components/ui/image'
import { Button } from '@renderer/shared/components/ui/button'
import { CircleUserRoundIcon, XIcon } from 'lucide-vue-next'
import type { NotificationBaseProps } from './types'
import type { NotificationGlobalRawInformation } from '@shared/definition/vrchat-notifications'

const props = defineProps<{
  base: NotificationBaseProps
  raw: NotificationGlobalRawInformation[typeof NotificationGlobalType.RequestInviteV1]
}>()

const emits = defineEmits<{
  (e: 'hideNotification'): void
  (e: 'readNotification'): void
  (e: 'showSender'): void
  (e: 'declineRequest'): void
  (e: 'declineRequestWithMessage'): void
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
    <div class="w-full flex flex-row items-center justify-start gap-4">
      <ImageRoot class="block size-10 bg-muted rounded-full overflow-hidden">
        <ImageVrchatContext
          v-if="props.base.senderAvatarFileId && props.base.senderAvatarFileVersion"
          :file-id="props.base.senderAvatarFileId"
          :version="props.base.senderAvatarFileVersion"
          class="size-full object-cover"
        />
        <ImageFallback class="size-full flex items-center justify-center">
          <CircleUserRoundIcon class="size-4 text-muted-foreground" />
        </ImageFallback>
      </ImageRoot>
      <div class="grid flex-1 text-left text-sm leading-tight gap-y-0.5">
        <div class="w-full flex flex-row items-center gap-1 overflow-hidden">
          <p class="flex-1 text-sm truncate">
            <Button
              as="a"
              class="bg-transparent dark:bg-transparent p-0 inline font-semibold hover:underline mr-1"
              @click="emits('showSender')"
            >
              {{ props.base.senderName }}
            </Button>
            <span class="font-medium text-muted-foreground">want to join you.</span>
          </p>
          <Button
            size="icon"
            variant="ghost"
            class="size-4 rounded-[4px] hidden group-hover/notification-card:flex"
          >
            <XIcon class="size-3.5" />
          </Button>
        </div>
        <p class="text-xs text-muted-foreground capitalize truncate">
          <RelativeTimerText :start-time="props.base.createdAt" />
        </p>
      </div>
    </div>
    <div v-if="props.raw.details.requestMessage" class="w-full pl-14 pb-0.5">
      <p class="text-xs text-muted-foreground text-left italic whitespace-pre-wrap leading-4.5">
        {{ props.raw.details.requestMessage }}
      </p>
    </div>
    <div class="flex flex-row items-center justify-start gap-1.5 pl-14 pb-0.5">
      <Button
        class="text-xs h-6 px-2 rounded-sm"
        size="sm"
        variant="secondary"
        @click="emits('declineRequest')"
      >
        Decline
      </Button>
      <Button
        class="text-xs h-6 px-2 rounded-sm"
        size="sm"
        variant="secondary"
        @click="emits('declineRequestWithMessage')"
      >
        Decline with message
      </Button>
    </div>
  </Button>
</template>

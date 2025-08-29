<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import { RelativeTimerText } from '@renderer/shared/components/timer'
import { NotificationGlobalType } from '@shared/definition/vrchat-notifications'
import { Button } from '@renderer/shared/components/ui/button'
import { XIcon } from 'lucide-vue-next'
import type { NotificationBaseProps } from './types'
import type { NotificationGlobalRawInformation } from '@shared/definition/vrchat-notifications'

const props = defineProps<{
  base: NotificationBaseProps
  raw: NotificationGlobalRawInformation[typeof NotificationGlobalType.VotetokickV1]
}>()

const emits = defineEmits<{
  (e: 'hideNotification'): void
  (e: 'readNotification'): void
  (e: 'showDetails'): void
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
      <div class="grid flex-1 text-left text-sm leading-tight gap-y-0.5">
        <div class="w-full flex flex-row items-center gap-1 overflow-hidden">
          <p class="flex-1 text-sm truncate">
            <span class="font-medium text-muted-foreground">
              A player is being kicked from the poll.
            </span>
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
    <div class="flex flex-row items-center justify-start gap-1.5">
      <Button
        class="text-xs h-6 px-2 rounded-sm"
        size="sm"
        variant="secondary"
        @click="emits('showDetails')"
      >
        View Details
      </Button>
    </div>
  </Button>
</template>

<script setup lang="ts">
import CurrentInstanceEventUserButton from './current-instance-event-user-button.vue'
import { cn } from '@renderer/shared/utils/style'
import { RelativeTimerText } from '@renderer/shared/components/timer'

const props = defineProps<{
  recordedAt: Date
  userName: string
  iconFileId?: string
  iconFileVersion?: number
}>()
</script>

<template>
  <div
    :class="
      cn(
        'py-3 pl-10 relative',
        'after:absolute after:content-normal after:left-5.5 after:top-0 after:h-full',
        'after:border-l-2 after:border-muted after:border-dotted after:-z-1',
        'last:after:h-5.5'
      )
    "
  >
    <div
      :class="
        cn(
          'relative flex flex-row items-center gap-2',
          'after:absolute after:content-normal',
          'after:top-1/2 after:-left-5 after:w-1.5 after:h-1.5',
          'after:-translate-y-1/2 after:bg-primary after:rounded-full'
        )
      "
    >
      <CurrentInstanceEventUserButton
        :icon-file-version="props.iconFileVersion"
        :icon-file-id="props.iconFileId"
        :user-name="props.userName"
      />
      <span class="text-[13px] text-muted-foreground">Joined this room</span>
    </div>
    <div class="h-4 mt-1">
      <RelativeTimerText :start-time="props.recordedAt" class="text-xs text-muted-foreground/70" />
    </div>
  </div>
</template>

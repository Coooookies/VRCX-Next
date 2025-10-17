<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import { RelativeTimerText } from '@renderer/shared/components/timer'

const props = defineProps<{
  recordedAt: Date
  videoPlaybackUrl: string
  lastItem?: boolean
}>()
</script>

<template>
  <div
    :class="
      cn(
        'py-3 pl-10 relative',
        'after:absolute after:content-normal after:left-5.5 after:top-0 after:h-full',
        'after:border-l-2 after:border-muted after:border-dotted after:-z-1',
        props.lastItem ? 'after:h-5.5' : 'after:h-full'
      )
    "
  >
    <div
      :class="
        cn(
          'relative flex flex-row items-center gap-2 h-6.5',
          'after:absolute after:content-normal',
          'after:top-1/2 after:-left-5 after:w-1.5 after:h-1.5',
          'after:-translate-y-1/2 after:bg-primary after:rounded-full'
        )
      "
    >
      <span class="text-[13px] text-muted-foreground">{{ props.videoPlaybackUrl }}</span>
    </div>
    <div class="h-4 mt-1">
      <RelativeTimerText :start-time="props.recordedAt" class="text-xs text-muted-foreground/70" />
    </div>
  </div>
</template>

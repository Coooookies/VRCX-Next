<script setup lang="ts">
import { ElapsedTimerText } from '@renderer/shared/components/timer'
import { cn } from '@renderer/shared/utils/style'

const props = defineProps<{
  joinedAt: Date | null
}>()
</script>

<template>
  <div class="h-10 bg-background rounded-md overflow-hidden">
    <div class="h-full pl-4 flex flex-row items-center bg-muted/50">
      <div class="flex flex-row items-center gap-2.5 text-xs">
        <div
          :class="
            cn(
              'relative size-3.5',
              'after:absolute after:inset-[3px] after:rounded-full after:bg-primary',
              'before:absolute before:inset-[3px] before:rounded-full before:bg-primary/20',
              'before:animate-[animation-timemark-ping_5s_infinite]'
            )
          "
        />
        <ElapsedTimerText v-if="props.joinedAt" :start-time="props.joinedAt" />
        <span v-else>{{ `--:--:--` }}</span>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes animation-timemark-ping {
  50%,
  100% {
    transform: scale(30);
    opacity: 0;
  }
}
</style>

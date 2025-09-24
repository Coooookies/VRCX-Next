<script setup lang="ts">
import { ElapsedTimerText } from '@renderer/shared/components/timer'
import { cn } from '@renderer/shared/utils/style'

const props = defineProps<{
  joinedAt: Date | null
}>()
</script>

<template>
  <div class="bg-muted/50 h-10 rounded-md pl-4 flex flex-row items-center">
    <div class="flex flex-row items-center gap-2 text-xs">
      <div
        :class="
          cn(
            'relative size-3.5',
            'after:absolute after:inset-[3px] after:rounded-full after:bg-primary',
            'before:absolute before:inset-[3px] before:rounded-full before:bg-primary',
            'before:animate-ping before:animation-duration-[1.5s]'
          )
        "
      />
      <ElapsedTimerText v-if="props.joinedAt" :start-time="props.joinedAt" />
      <span v-else>{{ `--:--:--` }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import ElapsedTimerText from '@renderer/shared/components/timer/elapsed-timer-text.vue'

const props = defineProps<{
  arrivedAt: Date | number | null
}>()
</script>

<template>
  <div class="flex flex-row items-center text-xs text-muted-foreground">
    <ElapsedTimerText v-if="props.arrivedAt" :start-time="props.arrivedAt" />
    <span v-else>{{ `--:--:--` }}</span>
  </div>
</template>

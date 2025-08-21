<script setup lang="ts">
import { computed, inject } from 'vue'
import type { Ref } from 'vue'

const props = defineProps<{
  startTime: Date | number
}>()

const { currentTime } = inject<{
  currentTime: Ref<number>
}>('elapsedTimer')!

const formattedTime = computed(() => {
  const start = typeof props.startTime === 'number' ? props.startTime : props.startTime.getTime()
  const elapsed = Math.max(0, currentTime.value - start)

  const hours = Math.floor(elapsed / (1000 * 60 * 60))
  const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((elapsed % (1000 * 60)) / 1000)

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})
</script>

<template>
  <span>{{ formattedTime }}</span>
</template>

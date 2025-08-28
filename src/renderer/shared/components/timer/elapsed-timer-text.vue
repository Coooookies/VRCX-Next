<script setup lang="ts">
import { computed, inject } from 'vue'
import { generateElapsedTime } from './format'
import type { Ref } from 'vue'

const props = defineProps<{
  startTime: Date | number
}>()

const { currentTime } = inject<{
  currentTime: Ref<number>
}>('globalTimer')!

const formattedTime = computed(() => {
  const start = typeof props.startTime === 'number' ? props.startTime : props.startTime.getTime()
  return generateElapsedTime(start, currentTime.value)
})
</script>

<template>
  <span>{{ formattedTime }}</span>
</template>

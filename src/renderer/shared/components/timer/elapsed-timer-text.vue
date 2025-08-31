<script setup lang="ts">
import { computed, inject } from 'vue'
import { generateElapsedTime } from './format'
import type { Ref } from 'vue'

const props = withDefaults(
  defineProps<{
    startTime: Date | number
    offset?: number
  }>(),
  {
    offset: 0
  }
)

const { currentTime } = inject<{
  currentTime: Ref<number>
}>('globalTimer')!

const formattedTime = computed(() => {
  const start = typeof props.startTime === 'number' ? props.startTime : props.startTime.getTime()
  return generateElapsedTime(start, currentTime.value - props.offset)
})
</script>

<template>
  <span>{{ formattedTime }}</span>
</template>

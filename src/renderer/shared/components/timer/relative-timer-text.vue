<script setup lang="ts">
import { computed, inject } from 'vue'
import { useI18n } from '@renderer/shared/locale'
import { generateRelativeTime } from './format'
import type { Ref } from 'vue'

const { t } = useI18n()

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
  return generateRelativeTime(start, currentTime.value - props.offset)(t)
})
</script>

<template>
  <span>{{ formattedTime }}</span>
</template>

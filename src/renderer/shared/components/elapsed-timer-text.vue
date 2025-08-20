<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  startTime: Date | number
}>()

const currentTime = ref(Date.now())
let timer: number | null = null

const formattedTime = computed(() => {
  const start = typeof props.startTime === 'number' ? props.startTime : props.startTime.getTime()
  const elapsed = Math.max(0, currentTime.value - start)

  const hours = Math.floor(elapsed / (1000 * 60 * 60))
  const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((elapsed % (1000 * 60)) / 1000)

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

onMounted(() => {
  timer = window.setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    window.clearInterval(timer)
  }
})
</script>

<template>
  <span>{{ formattedTime }}</span>
</template>

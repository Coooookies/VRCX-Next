<script setup lang="ts">
import Button from './Button.vue'
import { computed, onMounted, ref } from 'vue'
import type { ButtonProps } from './Button.vue'

interface CountdownButtonProps extends ButtonProps {
  countdown?: number
  autoStart?: boolean
}

const currentCountdown = ref(0)
const isCounting = computed(() => currentCountdown.value > 0)

const props = withDefaults(defineProps<CountdownButtonProps>(), {
  countdown: 60,
  autoStart: false
})

const emits = defineEmits<{
  (e: 'countdown-finished'): void
  (e: 'click', event: MouseEvent): void
}>()

const startCountdown = () => {
  if (props.countdown <= 0) return
  currentCountdown.value = props.countdown

  const interval = setInterval(() => {
    if (currentCountdown.value > 0) {
      currentCountdown.value--
    } else {
      clearInterval(interval)
      emits('countdown-finished')
    }
  }, 1000)
}

const handleClick = (event: MouseEvent) => {
  if (isCounting.value) {
    event.preventDefault()
    return
  }
  emits('click', event)
  startCountdown()
}

onMounted(() => {
  if (props.autoStart) {
    startCountdown()
  }
})
</script>

<template>
  <Button v-bind="props" :disabled="isCounting" @click="handleClick">
    <template v-if="isCounting">
      {{ currentCountdown }}
    </template>
    <template v-else>
      <slot />
    </template>
  </Button>
</template>

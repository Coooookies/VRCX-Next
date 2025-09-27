<script setup lang="ts">
import type { AsTag } from 'reka-ui'
import { computed } from 'vue'

interface ShinyTextProps {
  text?: string
  disabled?: boolean
  speed?: number
  className?: string
  as?: AsTag
}

const props = withDefaults(defineProps<ShinyTextProps>(), {
  disabled: false,
  speed: 5,
  as: 'span',
  className: ''
})

const animationDuration = computed(() => `${props.speed}s`)
</script>

<template>
  <component
    :is="props.as"
    :class="`text-[#b5b5b5a4] bg-clip-text inline-block ${!props.disabled ? 'animate-shine' : ''} ${props.className}`"
    :style="{
      backgroundImage:
        'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
      backgroundSize: '200% 100%',
      WebkitBackgroundClip: 'text',
      animationDuration: animationDuration
    }"
  >
    <template v-if="$slots.default">
      <slot />
    </template>
    <template v-else>
      {{ props.text }}
    </template>
  </component>
</template>

<style scoped>
@keyframes shine {
  0% {
    background-position: 100%;
  }
  100% {
    background-position: -100%;
  }
}

.animate-shine {
  animation: shine 5s linear infinite;
}
</style>

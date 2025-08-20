<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@renderer/shared/utils/style'

interface SkeletonProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<SkeletonProps>()
</script>

<template>
  <div
    data-slot="skeleton"
    :class="
      cn(
        'group relative overflow-hidden bg-muted/40 pointer-events-none rounded-md',
        'before:opacity-100 before:absolute before:inset-0 before:-translate-x-full',
        'before:bg-gradient-to-r before:from-transparent before:via-muted dark:before:via-muted/50 before:to-transparent',
        'before:animate-[animation-shimmer_1.5s_infinite]',
        props.class
      )
    "
  />
</template>

<style>
@keyframes animation-shimmer {
  100% {
    transform: translate(200%);
  }
}
</style>

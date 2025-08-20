<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import type { SidebarContainerProps } from './types'

const props = defineProps<SidebarContainerProps>()
const expanded = defineModel<boolean>('expanded')
const focus = defineModel<boolean>('focus', {
  default: false
})
</script>

<template>
  <div
    :class="
      cn(
        'absolute top-0 h-full',
        'transition-[width,background-color,box-shadow] duration-300 ease-[cubic-bezier(.16,1,.3,1)]',
        expanded || focus
          ? 'w-[var(--expand-width)] group/sidebar-expanded'
          : 'w-[var(--collapse-width)] hover:w-[var(--expand-width)] group/sidebar-collapsed'
      )
    "
    :style="{
      '--expand-width': `${props.expandWidth}px`,
      '--collapse-width': `${props.collapseWidth}px`
    }"
  >
    <slot />
  </div>
</template>

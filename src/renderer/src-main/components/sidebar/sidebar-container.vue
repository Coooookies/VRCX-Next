<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import type { SidebarContainerProps } from './types'

const expanded = defineModel<boolean>('expanded')
const props = defineProps<SidebarContainerProps>()
</script>

<template>
  <div
    :class="
      cn(
        'absolute top-0 h-full flex flex-row',
        'transition-[width,background-color,box-shadow] duration-300 ease-[cubic-bezier(.16,1,.3,1)]',
        expanded
          ? 'w-[var(--expand-width)]'
          : 'w-[var(--collapse-width)] hover:w-[var(--expand-width)] hover:shadow-[0_0_12px_0_#00000033]'
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

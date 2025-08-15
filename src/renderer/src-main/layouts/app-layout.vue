<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'

const props = defineProps<{
  expandWidth: number
  collapseWidth: number
  leftExpanded: boolean
  rightExpanded: boolean
}>()
</script>

<template>
  <div
    class="relative flex flex-row w-full h-full"
    :style="{
      '--expand-width': `${props.expandWidth}px`,
      '--collapse-width': `${props.collapseWidth}px`
    }"
  >
    <div
      :class="
        cn(
          'relative h-full z-10',
          props.leftExpanded ? 'w-[var(--expand-width)]' : 'w-[var(--collapse-width)]'
        )
      "
    >
      <slot name="left-sidebar" />
    </div>
    <div :class="cn('relative h-full flex-1')">
      <slot name="content" />
    </div>
    <div
      :class="
        cn(
          'relative h-full z-10',
          props.rightExpanded ? 'w-[var(--expand-width)]' : 'w-[var(--collapse-width)]'
        )
      "
    >
      <slot name="right-sidebar" />
    </div>
  </div>
</template>

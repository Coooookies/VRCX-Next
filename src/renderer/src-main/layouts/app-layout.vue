<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import { computed, provide } from 'vue'

const props = defineProps<{
  leftExpandWidth: number
  leftExpanded: boolean
  rightExpandWidth: number
  rightExpanded: boolean
  collapseWidth: number
}>()

const leftRoutePadding = computed(() =>
  props.leftExpanded ? props.leftExpandWidth : props.collapseWidth
)
const rightRoutePadding = computed(() =>
  props.rightExpanded ? props.rightExpandWidth : props.collapseWidth
)

provide('leftRoutePadding', leftRoutePadding)
provide('rightRoutePadding', rightRoutePadding)
</script>

<template>
  <div
    class="relative flex flex-row w-full h-full"
    :style="{
      '--left-expand-width': `${props.leftExpandWidth}px`,
      '--right-expand-width': `${props.rightExpandWidth}px`,
      '--collapse-width': `${props.collapseWidth}px`
    }"
  >
    <div
      :class="
        cn(
          'absolute top-0 left-0 h-full z-10',
          props.leftExpanded ? 'w-[var(--left-expand-width)]' : 'w-[var(--collapse-width)]'
        )
      "
    >
      <slot name="left-sidebar" />
    </div>
    <div :class="cn('relative w-full h-full')">
      <slot name="content" />
    </div>
    <div
      :class="
        cn(
          'absolute top-0 right-0 h-full z-10',
          props.rightExpanded ? 'w-[var(--right-expand-width)]' : 'w-[var(--collapse-width)]'
        )
      "
    >
      <slot name="right-sidebar" />
    </div>
  </div>
</template>

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

provide('routePadding', {
  leftExpanded: computed(() => props.leftExpanded),
  rightExpanded: computed(() => props.rightExpanded),
  leftRoutePadding,
  rightRoutePadding
})
</script>

<template>
  <div
    class="relative flex flex-row size-full"
    :style="{
      '--left-expand-width': `${props.leftExpandWidth}px`,
      '--right-expand-width': `${props.rightExpandWidth}px`,
      '--collapse-width': `${props.collapseWidth}px`
    }"
  >
    <div
      :class="
        cn(
          'absolute top-0 left-0 h-full z-10 peer/left-sidebar',
          props.leftExpanded ? 'w-[var(--left-expand-width)]' : 'w-[var(--collapse-width)]'
        )
      "
    >
      <slot name="left-sidebar" />
    </div>
    <div :class="cn('relative size-full')">
      <slot name="content" />
    </div>
    <div
      :class="
        cn(
          'absolute top-0 right-0 h-full z-10 peer/right-sidebar',
          props.rightExpanded ? 'w-[var(--right-expand-width)]' : 'w-[var(--collapse-width)]'
        )
      "
    >
      <slot name="right-sidebar" />
    </div>
    <div
      :class="
        cn(
          'absolute top-0 left-0 w-full',
          props.leftExpanded
            ? '[&_.title-bar]:pl-[var(--left-expand-width)]'
            : '[&_.title-bar]:pl-[var(--collapse-width)] peer-hover/left-sidebar:[&_.title-bar]:pl-[var(--left-expand-width)]',
          props.rightExpanded
            ? '[&_.title-bar]:pr-[var(--right-expand-width)]'
            : '[&_.title-bar]:pr-[var(--collapse-width)] peer-hover/right-sidebar:[&_.title-bar]:pr-[var(--right-expand-width)]'
        )
      "
    >
      <div class="title-bar w-full h-9">
        <div class="size-full electron-drag" />
      </div>
      <div
        :class="
          cn(
            'relative -mt-10 flex justify-center w-full',
            props.leftExpanded ? 'pl-[var(--left-expand-width)]' : 'pl-[var(--collapse-width)]',
            props.rightExpanded ? 'pr-[var(--right-expand-width)]' : 'pr-[var(--collapse-width)]'
          )
        "
      >
        <slot name="overlay" />
      </div>
    </div>
  </div>
</template>

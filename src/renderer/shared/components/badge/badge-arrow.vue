<script setup lang="ts">
import { computed } from 'vue'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpLeftIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  ArrowDownRightIcon
} from 'lucide-vue-next'
import { cn } from '@renderer/shared/utils/style'

interface ArrowButtonProps {
  direction?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
}

const props = withDefaults(defineProps<ArrowButtonProps>(), {
  direction: 'right'
})

const icon = computed(() => {
  switch (props.direction) {
    case 'top':
      return ArrowUpIcon
    case 'bottom':
      return ArrowDownIcon
    case 'left':
      return ArrowLeftIcon
    case 'right':
      return ArrowRightIcon
    case 'top-left':
      return ArrowUpLeftIcon
    case 'top-right':
      return ArrowUpRightIcon
    case 'bottom-left':
      return ArrowDownLeftIcon
    case 'bottom-right':
      return ArrowDownRightIcon
    default:
      return ArrowRightIcon
  }
})
</script>

<template>
  <div
    :class="
      cn(
        'relative size-8 p-0 flex items-center justify-center',
        'rounded-full hover:bg-transparent'
      )
    "
  >
    <component :is="icon" class="size-4 text-default" />
    <div
      :class="
        cn(
          'absolute top-0 left-0 w-full h-full border-1 border-accented rounded-[inherit]',
          'mask-linear-135 mask-linear-from-20% mask-linear-to-100%'
        )
      "
    />
  </div>
</template>

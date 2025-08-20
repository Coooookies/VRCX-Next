<script setup lang="ts">
import { Skeleton } from '@renderer/shared/components/ui/skeleton'
import { cn } from '@renderer/shared/utils/style'

const line1BlockWitch = Math.random() * 70 + 90
const line2BlockWitch = Math.random() * 20 + 200
</script>

<template>
  <div
    class="w-full h-14 flex items-center justify-start px-4.5 pr-5.5 gap-2.5"
    :style="{
      '--line-1-block-width': `${line1BlockWitch}px`,
      '--line-2-block-width': `${line2BlockWitch}px`
    }"
  >
    <Skeleton class="size-9 rounded-full" />
    <div
      :class="
        cn(
          'grid flex-1 gap-y-1',
          'opacity-0 transition-opacity duration-200 ease-[cubic-bezier(.16,1,.3,1)]',
          'group-has-[*]/sidebar-expanded:opacity-100 group-hover/sidebar-collapsed:opacity-100'
        )
      "
    >
      <Skeleton class="w-[var(--line-1-block-width)] h-3.5 rounded-sm" />
      <Skeleton class="w-[var(--line-2-block-width)] h-3.5 rounded-sm" />
    </div>
  </div>
</template>

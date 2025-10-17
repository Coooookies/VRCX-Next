<script setup lang="ts">
import { Skeleton } from '@renderer/shared/components/ui/skeleton'
import { cn } from '@renderer/shared/utils/style'

const randomWidth = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
</script>

<template>
  <div
    :class="cn('w-full h-full flex flex-col gap-2 justify-start flex-1 text-left overflow-hidden')"
  >
    <Skeleton
      class="h-3.5 rounded-sm"
      :style="{
        width: `${randomWidth(20, 50)}%`
      }"
    />
    <div :class="cn('grid grid-cols-2 gap-2 items-center')">
      <Skeleton class="h-7 gap-0 rounded-[10px]" />
      <Skeleton class="h-7 gap-0 rounded-[10px]" />
    </div>
  </div>
</template>

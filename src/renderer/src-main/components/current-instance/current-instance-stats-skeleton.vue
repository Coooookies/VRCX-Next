<script setup lang="ts">
import { Skeleton } from '@renderer/shared/components/ui/skeleton'

const randomWidth = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
</script>

<template>
  <div class="w-full h-10 flex flex-col gap-1.5 justify-center flex-1 text-left overflow-hidden">
    <Skeleton
      class="h-3.5 rounded-sm"
      :style="{
        width: `${randomWidth(30, 50)}%`
      }"
    />
    <Skeleton
      class="h-3.5 rounded-sm"
      :style="{
        width: `${randomWidth(40, 80)}%`
      }"
    />
  </div>
</template>

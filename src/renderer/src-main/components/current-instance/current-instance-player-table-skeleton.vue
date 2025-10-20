<script setup lang="ts">
import { Skeleton } from '@renderer/shared/components/ui/skeleton'
import { cn } from '@renderer/shared/utils/style'

const randomSize = Math.ceil(Math.random() * 6) + 6
const randomWidth = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
</script>

<template>
  <div class="w-full">
    <Skeleton class="h-10 rounded-md" />
    <div class="pt-1.5">
      <div
        v-for="(_, i) in Array(randomSize).fill(0)"
        :key="i"
        :class="
          cn(
            'h-12 flex flex-row items-center pl-3.5',
            'animate-[animation-skeleton-fadein_2s_ease-in-out_backwards]'
          )
        "
        :style="{
          animationDelay: `${i < randomSize / 3 ? 1 : i < (randomSize / 3) * 2 ? 3 : 5}s`
        }"
      >
        <div class="flex flex-row gap-4 items-center">
          <Skeleton class="size-6 rounded-full" />
          <Skeleton
            class="h-4 rounded-sm"
            :style="{
              width: randomWidth(80, 140) + 'px'
            }"
          />
        </div>
        <div class="ml-auto w-30 flex flex-row items-center gap-1">
          <Skeleton
            class="h-4 rounded-sm"
            :style="{
              width: randomWidth(16, 80) + 'px'
            }"
          />
        </div>
        <div class="w-30 flex-row items-center hidden @5xl:flex">
          <Skeleton
            class="h-4 rounded-sm"
            :style="{
              width: randomWidth(16, 80) + 'px'
            }"
          />
        </div>
        <div class="w-30 flex flex-row items-center">
          <Skeleton
            class="h-4 rounded-sm"
            :style="{
              width: randomWidth(48, 80) + 'px'
            }"
          />
        </div>
        <div class="w-10 pl-1 flex flex-row items-center">
          <Skeleton class="size-4 rounded-sm" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes animation-skeleton-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>

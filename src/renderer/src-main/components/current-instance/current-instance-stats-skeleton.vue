<script setup lang="ts">
import { Skeleton } from '@renderer/shared/components/ui/skeleton'

const line1Witdh = 20 + Math.floor(Math.random() * 30)
const line2Witdh = 40 + Math.floor(Math.random() * 40)
</script>

<template>
  <div class="w-full h-10 flex flex-col gap-1.5 justify-center flex-1 text-left overflow-hidden">
    <Skeleton
      class="h-3.5 rounded-sm"
      :style="{
        width: `${line1Witdh}%`
      }"
    />
    <Skeleton
      class="h-3.5 rounded-sm"
      :style="{
        width: `${line2Witdh}%`
      }"
    />
  </div>
</template>

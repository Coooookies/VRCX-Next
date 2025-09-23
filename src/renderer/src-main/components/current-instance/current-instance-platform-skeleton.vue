<script setup lang="ts">
import { Skeleton } from '@renderer/shared/components/ui/skeleton'
import { cn } from '@renderer/shared/utils/style'

const lineWitdh = 20 + Math.floor(Math.random() * 30)
</script>

<template>
  <div
    :class="
      cn(
        'w-full h-full flex flex-col gap-2.25 pt-0.75 justify-start flex-1 text-left overflow-hidden',
        '@5xl:h-fit'
      )
    "
  >
    <Skeleton
      class="h-3.5 rounded-sm"
      :style="{
        width: `${lineWitdh}%`
      }"
    />
    <div :class="cn('grid grid-cols-2 gap-2 items-center', '@5xl:grid-cols-2')">
      <Skeleton class="h-7 gap-0 rounded-[10px]" />
      <Skeleton class="h-7 gap-0 rounded-[10px]" />
    </div>
  </div>
</template>

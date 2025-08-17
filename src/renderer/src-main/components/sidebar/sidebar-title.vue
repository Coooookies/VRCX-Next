<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import ZypherIcon from '@shared/assets/vector/navigator-icon-zypher.svg?component'
import ZypherTitle from '@shared/assets/vector/navigator-title-zypher.svg?component'
</script>

<template>
  <div class="relative w-full h-12 flex items-center overflow-hidden">
    <div class="relative pl-6 h-6 flex flex-row">
      <ZypherIcon class="shrink-0 size-6" />
      <div
        :class="
          cn(
            'pl-4 transition-[opacity,translate] duration-300 ease-[cubic-bezier(.16,1,.3,1)]',
            'group-has-[*]/sidebar-expanded:translate-x-0 group-has-[*]/sidebar-expanded:opacity-100',
            'group-hover/sidebar-collapsed:translate-x-0 group-hover/sidebar-collapsed:opacity-100 -translate-x-1 opacity-0'
          )
        "
      >
        <ZypherTitle class="absolute w-18.5 h-6" />
      </div>
    </div>
  </div>
</template>

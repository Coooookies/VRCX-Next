<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import AppTitle from '@shared/assets/vector/icon-vrcx.svg?component'
</script>

<template>
  <div class="relative w-full h-12">
    <AppTitle
      :class="
        cn(
          'absolute w-16 h-5.5 top-1/2 translate-x-[4px] -translate-y-1/2 scale-65',
          'transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)]',
          'group-hover/sidebar-collapsed:scale-90 group-hover/sidebar-collapsed:translate-x-5.5',
          'group-has-[*]/sidebar-expanded:scale-90 group-has-[*]/sidebar-expanded:translate-x-5.5'
        )
      "
    />
  </div>
</template>

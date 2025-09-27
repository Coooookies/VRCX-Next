<script setup lang="ts">
import ShinyText from '@renderer/shared/components/shiny-text.vue'
import { ArrowDownIcon } from 'lucide-vue-next'
</script>

<template>
  <div class="relative w-full h-screen flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <div class="size-16 rounded-full border flex flex-col items-center">
        <ArrowDownIcon
          class="mt-4.5 size-8 text-foreground animate-bounce animation-duration-1000"
        />
      </div>
      <div>
        <p class="font-semibold text-2xl text-center">Waiting for join room.</p>
        <ShinyText as="p" :speed="2" class="w-full text-sm text-center">Processing...</ShinyText>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouteForward } from '@renderer/src-main/composables/route'
import { ChevronLeftIcon, ChevronRightIcon, RotateCcwIcon } from 'lucide-vue-next'
import HeaderActionButton from './header-action-button.vue'
import HeaderInput from './header-input.vue'

const { canGoBack, canGoForward, backRoute, forwardRoute } = useRouteForward()
</script>

<template>
  <div class="mx-auto pt-6 flex flex-row gap-3">
    <div class="flex flex-row items-center w-14 h-8 justify-between">
      <HeaderActionButton :disabled="!canGoBack" @click="backRoute">
        <ChevronLeftIcon class="size-4.5" />
      </HeaderActionButton>
      <HeaderActionButton :disabled="!canGoForward" @click="forwardRoute">
        <ChevronRightIcon class="size-4.5" />
      </HeaderActionButton>
    </div>
    <HeaderInput class="h-8" />
    <div class="flex flex-row items-center w-14 h-8 justify-between">
      <HeaderActionButton>
        <RotateCcwIcon class="size-3.5" />
      </HeaderActionButton>
    </div>
  </div>
</template>

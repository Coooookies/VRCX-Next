<script setup lang="ts">
import ScrollContainer from '@renderer/shared/components/scroll-container.vue'
import { inject } from 'vue'
import type { Ref } from 'vue'
import type { ScrollContainerProps } from '@renderer/shared/components/scroll-container.vue'

const props = defineProps<ScrollContainerProps>()
const leftRoutePadding = inject<Ref<number>>('leftRoutePadding')!
const rightRoutePadding = inject<Ref<number>>('rightRoutePadding')!
</script>

<template>
  <ScrollContainer
    v-bind="props"
    class="w-full h-full"
    :scrollbar-offset-right="4 + rightRoutePadding"
  >
    <div class="relative w-full">
      <div class="absolute top-0 left-0 w-full">
        <slot name="background" />
      </div>
      <div
        class="relative w-full box-border"
        :style="{
          paddingLeft: `${leftRoutePadding}px`,
          paddingRight: `${rightRoutePadding}px`
        }"
      >
        <slot />
      </div>
    </div>
  </ScrollContainer>
</template>

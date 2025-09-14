<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@renderer/shared/utils/style'

const props = defineProps<{
  class?: HTMLAttributes['class']
  containerClass?: HTMLAttributes['class']
}>()
</script>

<template>
  <div data-slot="table-container" :class="cn('w-full', props.containerClass)">
    <table data-slot="table" :class="cn('w-full caption-bottom text-sm', props.class)">
      <slot />
    </table>
  </div>
</template>

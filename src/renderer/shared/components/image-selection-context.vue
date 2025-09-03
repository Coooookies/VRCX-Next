<script setup lang="ts">
import { ImageContext } from './ui/image'
import type { ImageContextProps } from './ui/image'

const props = withDefaults(
  defineProps<
    Omit<ImageContextProps, 'src'> & {
      selectionId: string
      size?: number
    }
  >(),
  {
    size: 64
  }
)
const imageUrl = props.selectionId
  ? `vrcxnext://image-selection-proxy/image/${props.selectionId}/${props.size}`
  : ``
</script>

<template>
  <ImageContext v-bind="props" :src="imageUrl" />
</template>

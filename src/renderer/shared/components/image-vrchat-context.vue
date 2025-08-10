<script setup lang="ts">
import { ImageContext } from './ui/image'
import type { ImageContextProps } from './ui/image'

const props = withDefaults(
  defineProps<
    Omit<ImageContextProps, 'src'> & {
      fileId: string
      version: number
      size?: number
    }
  >(),
  {
    size: 64
  }
)
const imageUrl = props.fileId
  ? `vrcxnext://vrchat-proxy/image/${props.fileId}/${props.version}/${props.size}`
  : ``
</script>

<template>
  <ImageContext v-bind="props" :src="imageUrl" />
</template>

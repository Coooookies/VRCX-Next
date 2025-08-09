<script lang="ts">
import type { Ref } from 'vue'
import type { ImageLoadingStatus } from './utils'
import type { PrimitiveProps } from 'reka-ui'

export interface ImageRootProps extends PrimitiveProps {}

export type ImageRootContext = {
  imageLoadingStatus: Ref<ImageLoadingStatus>
}

export const [injectImageRootContext, provideImageRootContext] =
  createContext<ImageRootContext>('ImageRoot')
</script>

<script setup lang="ts">
import { ref } from 'vue'
import { createContext, Primitive, useForwardExpose } from 'reka-ui'

withDefaults(defineProps<ImageRootProps>(), {
  as: 'span'
})

useForwardExpose()

provideImageRootContext({
  imageLoadingStatus: ref<ImageLoadingStatus>('idle')
})
</script>

<template>
  <Primitive :as-child="asChild" :as="as">
    <slot />
  </Primitive>
</template>

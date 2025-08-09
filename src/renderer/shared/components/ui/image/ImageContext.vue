<script lang="ts">
import type { ImageLoadingStatus } from './utils'
import { Primitive, useForwardExpose } from 'reka-ui'

export type ImageContextEmits = {
  /**
   * A callback providing information about the loading status of the image. <br>
   * This is useful in case you want to control more precisely what to render as the image is loading.
   */
  loadingStatusChange: [value: ImageLoadingStatus]
}
export interface ImageContextProps extends PrimitiveProps {
  src: string
  referrerPolicy?: ImgHTMLAttributes['referrerpolicy']
  crossOrigin?: ImgHTMLAttributes['crossorigin']
}
</script>

<script setup lang="ts">
import type { ImgHTMLAttributes } from 'vue'
import type { PrimitiveProps } from 'reka-ui'
import { toRefs, watch } from 'vue'
import { injectImageRootContext } from './ImageRoot.vue'
import { useImageLoadingStatus } from './utils'

const props = withDefaults(defineProps<ImageContextProps>(), { as: 'img' })
const emits = defineEmits<ImageContextEmits>()

const { src, referrerPolicy, crossOrigin } = toRefs(props)
useForwardExpose()
const rootContext = injectImageRootContext()

const imageLoadingStatus = useImageLoadingStatus(src, { referrerPolicy, crossOrigin })

watch(
  imageLoadingStatus,
  (newValue) => {
    emits('loadingStatusChange', newValue)
    if (newValue !== 'idle') rootContext.imageLoadingStatus.value = newValue
  },
  { immediate: true }
)
</script>

<template>
  <Primitive
    v-show="imageLoadingStatus === 'loaded'"
    role="img"
    :as-child="asChild"
    :as="as"
    :src="src"
    :referrer-policy="referrerPolicy"
  >
    <slot />
  </Primitive>
</template>

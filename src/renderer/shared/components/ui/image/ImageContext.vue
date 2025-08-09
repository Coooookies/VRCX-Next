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
  lazy?: boolean
  rootMargin?: string
  threshold?: number
}
</script>

<script setup lang="ts">
import type { ImgHTMLAttributes } from 'vue'
import type { PrimitiveProps } from 'reka-ui'
import { computed, ref, toRefs, watch } from 'vue'
import { injectImageRootContext } from './ImageRoot.vue'
import { useElementOnceVisibility, useImageLoadingStatus } from './utils'

const props = withDefaults(defineProps<ImageContextProps>(), {
  as: 'img',
  lazy: false,
  rootMargin: '0px',
  threshold: 0.1
})
const emits = defineEmits<ImageContextEmits>()

const { src, referrerPolicy, crossOrigin, lazy, rootMargin, threshold } = toRefs(props)
useForwardExpose()
const rootContext = injectImageRootContext()

const elementRef = ref<HTMLElement | null>(null)
const isIntersecting = useElementOnceVisibility(elementRef, {
  rootMargin: rootMargin.value,
  threshold: threshold.value
})

const shouldLoadImage = computed(() => {
  if (!lazy.value) return true
  return isIntersecting.value
})

const actualSrc = computed(() => {
  return shouldLoadImage.value ? src.value : undefined
})

const imageLoadingStatus = useImageLoadingStatus(actualSrc, { referrerPolicy, crossOrigin })

watch(
  [lazy, shouldLoadImage, src],
  ([isLazy, shouldLoad, srcValue]) => {
    if (isLazy && !shouldLoad && srcValue) {
      emits('loadingStatusChange', 'pending')
      rootContext.imageLoadingStatus.value = 'pending'
    }
  },
  { immediate: true }
)

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
  <span v-if="lazy && !shouldLoadImage" ref="elementRef" role="span" class="inline-block" />
  <Primitive
    v-else-if="imageLoadingStatus === 'loaded'"
    role="img"
    :as-child="asChild"
    :as="as"
    :src="src"
    :referrer-policy="referrerPolicy"
    :cross-origin="crossOrigin"
  >
    <slot />
  </Primitive>
</template>

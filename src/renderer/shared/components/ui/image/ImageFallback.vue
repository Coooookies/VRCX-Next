<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import { isClient } from '@vueuse/shared'

export interface ImageFallbackProps extends PrimitiveProps {
  /** Useful for delaying rendering so it only appears for those with slower connections. */
  delayMs?: number
}
</script>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { Primitive, useForwardExpose } from 'reka-ui'
import { injectImageRootContext } from './ImageRoot.vue'

const props = withDefaults(defineProps<ImageFallbackProps>(), {
  as: 'span'
})

const rootContext = injectImageRootContext()
useForwardExpose()

const canRender = ref(props.delayMs === undefined)

watchEffect((onCleanup) => {
  if (props.delayMs && isClient) {
    const timerId = window.setTimeout(() => {
      canRender.value = true
    }, props.delayMs)

    onCleanup(() => {
      window.clearTimeout(timerId)
    })
  }
})
</script>

<template>
  <Primitive
    v-if="canRender && rootContext.imageLoadingStatus.value !== 'loaded'"
    :as-child="asChild"
    :as="as"
  >
    <template
      v-if="
        rootContext.imageLoadingStatus.value === 'loading' ||
        rootContext.imageLoadingStatus.value === 'pending'
      "
    >
      <slot name="loading" />
    </template>
    <template v-else>
      <slot />
    </template>
  </Primitive>
</template>

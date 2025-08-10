<script setup lang="ts">
import { onMounted, computed, ref, onUnmounted, useTemplateRef } from 'vue'

const emitter = defineEmits<{
  (e: 'scroll', rate: number, top: number): void
}>()

export interface ScrollContainerExpose {
  scrollTo: (top: number) => void
  getBoundingClientRect: () => DOMRect
}

const props = withDefaults(
  defineProps<{
    scrollbarOffsetTop?: number
    scrollbarOffsetBottom?: number
    scrollbarOffsetRight?: number
    scrollbarWidth?: number
    fadeOutAtTop?: boolean
    fadeOutAtBottom?: boolean
  }>(),
  {
    scrollbarOffsetTop: 4,
    scrollbarOffsetBottom: 4,
    scrollbarOffsetRight: 4,
    scrollbarWidth: 4,
    fadeOutAtTop: false,
    fadeOutAtBottom: false
  }
)

const container = useTemplateRef('container')
const content = useTemplateRef('content')
const scrollbar = useTemplateRef('scrollbar')
const scrollbarThumb = useTemplateRef('scrollbarThumb')

const scrollState = ref<'top' | 'bottom' | 'all' | 'none'>('top')
const scrollStartPosition = ref(0)
const scrollStartOffset = ref(0)
const scrollTop = ref(0)
const scrollHeight = ref(0)
const containerHeight = ref(0)
const scrollBarContainerHeight = ref(0)
const scrollBarMouseDown = ref(false)
const scrollVisible = computed(() => scrollHeight.value > containerHeight.value)

const scrollThumbProportion = computed(() => containerHeight.value / scrollHeight.value)
const scrollThumbRate = computed(() => scrollTop.value / scrollHeight.value)

const ThumbMouseDown = (event: MouseEvent): void => {
  scrollBarMouseDown.value = true
  scrollBarContainerHeight.value = scrollbar.value!.clientHeight
  scrollStartOffset.value = event.clientY - scrollbar.value!.offsetTop
  scrollStartPosition.value = scrollbarThumb.value!.offsetTop
}

const ThumbMouseMove = (event: MouseEvent): void => {
  if (!scrollBarMouseDown.value) return
  const newOffsetTop = event.clientY - scrollbar.value!.offsetTop - scrollStartOffset.value
  const nextOffsetRate = (scrollStartPosition.value + newOffsetTop) / scrollBarContainerHeight.value

  container.value!.scrollTop = nextOffsetRate * scrollHeight.value
}

const ThumbMouseUp = (): void => {
  scrollBarMouseDown.value = false
}

const updateScrollbar = (): void => {
  if (!container.value) return

  scrollTop.value = container.value.scrollTop
  scrollHeight.value = container.value!.scrollHeight
  containerHeight.value = container.value!.clientHeight

  // 高度不足以显示滚动条
  if (scrollHeight.value <= containerHeight.value) {
    scrollState.value = 'none'
    emitter('scroll', 0, 0)
    return
  }

  emitter(
    'scroll',
    Math.round((scrollTop.value / (scrollHeight.value - containerHeight.value)) * 1000) / 1000,
    scrollTop.value
  )

  if (scrollTop.value <= 1) {
    scrollState.value = 'top'
  } else if (Math.abs(scrollTop.value + containerHeight.value - scrollHeight.value) <= 1) {
    scrollState.value = 'bottom'
  } else {
    scrollState.value = 'all'
  }
}

const resizeObserver = new ResizeObserver(updateScrollbar)

onMounted(() => {
  if (content.value) {
    // eslint-disable-next-line no-undef
    const option: ResizeObserverOptions = {
      box: 'content-box'
    }

    resizeObserver.observe(content.value!, option)
    resizeObserver.observe(container.value!, option)

    updateScrollbar()
    window.addEventListener('mousemove', ThumbMouseMove)
    window.addEventListener('mouseup', ThumbMouseUp)
  }
})

onUnmounted(() => {
  resizeObserver.disconnect()
  window.removeEventListener('mousemove', ThumbMouseMove)
  window.removeEventListener('mouseup', ThumbMouseUp)
})

defineExpose({
  scrollTo: (top: number) => {
    container.value!.scrollTop = top
  },
  getBoundingClientRect: () => {
    return container.value!.getBoundingClientRect()
  }
})
</script>

<template>
  <div class="scroll-container" @mouseenter="updateScrollbar">
    <div
      ref="container"
      class="scroll-container__content"
      :class="{
        'fade-out-top': props.fadeOutAtTop,
        'fade-out-bottom': props.fadeOutAtBottom,
        'hide-top': scrollState === 'top',
        'hide-bottom': scrollState === 'bottom',
        'hide-all': scrollState === 'all'
      }"
      @scroll="updateScrollbar"
    >
      <div ref="content" class="__content">
        <slot class="__content" />
      </div>
    </div>
    <div
      ref="scrollbar"
      class="scroll-container__scrollbar"
      :class="{ 'scroll-visible': scrollVisible }"
      :style="[
        `--scroll-bar-offset-top: ${props.scrollbarOffsetTop}px;`,
        `--scroll-bar-offset-bottom: ${props.scrollbarOffsetBottom}px;`,
        `--scroll-bar-offset-right: ${props.scrollbarOffsetRight}px;`,
        `--scroll-bar-width: ${props.scrollbarWidth}px;`
      ]"
    >
      <div
        ref="scrollbarThumb"
        class="__thumb"
        :style="[
          `--scroll-thumb-proportion: ${scrollThumbProportion};`,
          `--scroll-thumb-rate: ${scrollThumbRate};`
        ]"
        @mousedown="ThumbMouseDown"
      />
    </div>
  </div>
</template>

<style scoped>
.scroll-container {
  position: relative;
  overflow: hidden;
}

.scroll-container__content {
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  min-height: inherit;
  max-height: inherit;
}

.scroll-container__content::-webkit-scrollbar {
  display: none;
}

.scroll-container__content.fade-out-bottom.hide-all,
.scroll-container__content.fade-out-bottom.hide-top {
  mask-image: linear-gradient(#000 95%, transparent);
}

.scroll-container__content.fade-out-top.hide-all,
.scroll-container__content.fade-out-top.hide-bottom {
  mask-image: linear-gradient(transparent, #000 5%);
}

.scroll-container__content.fade-out-top.fade-out-bottom.hide-all {
  mask-image: linear-gradient(transparent, #000 5%, #000 95%, transparent);
}

.scroll-container:hover .scroll-container__scrollbar .__thumb {
  background-color: color-mix(in oklab, var(--foreground) 5%, transparent);
  backdrop-filter: blur(4px);
}

.scroll-container__scrollbar {
  --scroll-bar-offset-top: 0px;
  --scroll-bar-offset-bottom: 0px;
  --scroll-bar-offset-right: 0px;
  --scroll-bar-width: 0px;
  display: none;
  position: absolute;
  top: var(--scroll-bar-offset-top);
  bottom: var(--scroll-bar-offset-bottom);
  right: var(--scroll-bar-offset-right);
  width: var(--scroll-bar-width);
  transition: width 0.3s;
  z-index: 1000;
}

.scroll-container__scrollbar.scroll-visible {
  display: block;
}

.scroll-container__scrollbar .__thumb {
  --scroll-thumb-proportion: 0;
  --scroll-thumb-rate: 0;
  position: absolute;
  left: 0;
  width: 100%;
  top: calc(var(--scroll-thumb-rate) * 100%);
  height: calc(var(--scroll-thumb-proportion) * 100%);
  background-color: transparent;
  border-radius: 2px;
  transition: background-color 0.2s;
}

.scroll-container:hover .scroll-container__scrollbar .__thumb:hover {
  background-color: color-mix(in oklab, var(--foreground) 16%, transparent);
}

.scroll-container:hover .scroll-container__scrollbar .__thumb:active {
  background-color: color-mix(in oklab, var(--foreground) 12%, transparent);
  transition: background-color 0s;
}

.scroll-container__scrollbar:hover,
.scroll-container__scrollbar:active {
  width: 8px;
  transition: width 0.1s ease;
}

.scroll-container__scrollbar:hover .__thumb,
.scroll-container__scrollbar:active .__thumb {
  border-radius: 2px;
}
</style>

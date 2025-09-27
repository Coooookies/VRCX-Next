<script setup lang="ts">
import ScrollContainer from '@renderer/shared/components/scroll-container.vue'
import { inject } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import type { HTMLAttributes, Ref } from 'vue'
import type { ScrollContainerProps } from '@renderer/shared/components/scroll-container.vue'

const props = defineProps<
  ScrollContainerProps & {
    class?: HTMLAttributes['class']
  }
>()
const { leftExpanded, rightExpanded, leftRoutePadding, rightRoutePadding } = inject<{
  leftExpanded: Ref<boolean>
  rightExpanded: Ref<boolean>
  leftRoutePadding: Ref<number>
  rightRoutePadding: Ref<number>
}>('routePadding')!
</script>

<template>
  <ScrollContainer
    v-bind="props"
    :class="cn('size-full', props.class)"
    :scrollbar-offset-top="40"
    :scrollbar-offset-right="4 + rightRoutePadding"
  >
    <div
      :class="
        cn(
          'relative w-full',
          leftExpanded && 'group/left-expanded',
          rightExpanded && 'group/right-expanded'
        )
      "
      :style="{
        '--sidebar-padding-left': `${leftRoutePadding}px`,
        '--sidebar-padding-right': `${rightRoutePadding}px`
      }"
    >
      <div class="absolute top-0 left-0 w-full">
        <slot name="background" />
      </div>
      <div
        class="relative w-full box-border"
        :style="{
          paddingLeft: `var(--sidebar-padding-left)`,
          paddingRight: `var(--sidebar-padding-right)`
        }"
      >
        <slot />
      </div>
    </div>
  </ScrollContainer>
</template>

<script setup lang="ts">
import { Button } from '@renderer/shared/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@renderer/shared/components/ui/hover-card'
import { cn } from '@renderer/shared/utils/style'
import { FunctionalComponent, HTMLAttributes } from 'vue'

const props = defineProps<{
  icon: FunctionalComponent
  label?: string
  hotspot?: boolean
  class: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <HoverCard>
    <HoverCardTrigger>
      <Button
        variant="secondary"
        :class="
          cn(
            'relative w-10 h-9 group/sidebar-button',
            'bg-sidebar-foreground/5 dark:bg-input/55 hover:bg-sidebar-foreground/10 hover:dark:bg-input/80 active:bg-sidebar-foreground/5 active:dark:!bg-input/40',
            props.class
          )
        "
        @click="emits('click', $event)"
      >
        <div
          :class="
            cn(
              'relative size-5.5 shrink-0',
              props.hotspot
                ? 'after:absolute after:top-0 after:right-0 after:w-[5px] after:h-[5px] after:rounded-full after:bg-destructive'
                : ''
            )
          "
        >
          <component
            :is="props.icon"
            :class="
              cn(
                'size-full transition-colors duration-200 ease-in-out',
                'text-sidebar-foreground/55 group-hover/sidebar-button:text-sidebar-foreground/70',
                'dark:text-sidebar-foreground/50 group-hover/sidebar-button:dark:text-sidebar-foreground/70',
                props.hotspot && '!text-sidebar-foreground/85 dark:!text-sidebar-foreground/90'
              )
            "
            :style="{
              maskImage: props.hotspot ? 'var(--mask-sidebar-action-icon)' : 'none'
            }"
          />
        </div>
      </Button>
    </HoverCardTrigger>
    <HoverCardContent v-if="props.label" class="w-auto px-2 py-1 text-xs" :side-offset="6">
      {{ props.label }}
    </HoverCardContent>
  </HoverCard>
</template>

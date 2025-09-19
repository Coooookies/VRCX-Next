<script setup lang="ts">
import { Button } from '@renderer/shared/components/ui/button'
import { cn } from '@renderer/shared/utils/style'
import { FunctionalComponent } from 'vue'
import type { ButtonVariants } from '@renderer/shared/components/ui/button'

const props = withDefaults(
  defineProps<{
    icon: FunctionalComponent
    label: string
    active?: boolean
    variant?: ButtonVariants['variant']
  }>(),
  {
    variant: 'link'
  }
)
</script>

<template>
  <div class="w-full h-10 px-3">
    <Button
      :variant="props.variant"
      :class="
        cn(
          'relative size-full pr-0 pl-3 overflow-hidden justify-start gap-0',
          'group/sidebar-button',
          props.variant === 'secondary'
            ? props.active
              ? '!bg-sidebar-foreground/10 dark:!bg-secondary/50'
              : 'bg-sidebar-foreground/5 dark:bg-input/55 hover:bg-sidebar-foreground/10 hover:dark:bg-input/80 active:bg-sidebar-foreground/5 active:dark:!bg-input/40'
            : ''
        )
      "
    >
      <div class="size-6 shrink-0">
        <component
          :is="props.icon"
          :class="
            cn(
              'size-full transition-colors duration-200 ease-in-out',
              'text-sidebar-foreground/55 group-hover/sidebar-button:text-sidebar-foreground/70',
              'dark:text-sidebar-foreground/40 group-hover/sidebar-button:dark:text-sidebar-foreground/65',
              props.active && '!text-sidebar-foreground/85 dark:!text-sidebar-foreground/90'
            )
          "
        />
      </div>
      <div
        :class="
          cn(
            'w-60 h-full flex items-center pl-4 transition-[opacity,translate] duration-300 ease-[cubic-bezier(.16,1,.3,1)]',
            'group-has-[*]/sidebar-expanded:translate-x-0 group-has-[*]/sidebar-expanded:opacity-100',
            'group-hover/sidebar-collapsed:translate-x-0 group-hover/sidebar-collapsed:opacity-100 -translate-x-1 opacity-0'
          )
        "
      >
        <span
          :class="
            cn(
              'absolute font-medium whitespace-nowrap max-w-full pr-5',
              'text-sidebar-foreground/55 group-hover/sidebar-button:text-sidebar-foreground/70',
              'dark:text-sidebar-foreground/45 group-hover/sidebar-button:dark:text-sidebar-foreground/65',
              'transition-[color,font-weight] duration-200 ease-in-out',
              props.active &&
                'font-bold !text-sidebar-foreground/85 dark:!text-sidebar-foreground/90'
            )
          "
        >
          {{ props.label }}
        </span>
      </div>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@renderer/shared/components/ui/button'
import { cn } from '@renderer/shared/utils/style'
import { FunctionalComponent } from 'vue'

const props = defineProps<{
  icon: FunctionalComponent
  label: string
  active?: boolean
}>()
</script>

<template>
  <Button
    variant="secondary"
    :class="
      cn(
        'relative w-10 h-9.5 group/sidebar-button',
        props.active
          ? '!bg-sidebar-foreground/10 dark:!bg-secondary/50'
          : 'bg-sidebar-foreground/5 dark:bg-input/40 hover:bg-sidebar-foreground/10 hover:dark:bg-input/50 active:bg-sidebar-foreground/5 active:dark:!bg-input/30'
      )
    "
  >
    <div class="size-5.5 shrink-0">
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
  </Button>
</template>

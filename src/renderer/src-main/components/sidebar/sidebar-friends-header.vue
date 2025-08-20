<script setup lang="ts">
import type { FunctionalComponent } from 'vue'
import { Button } from '@renderer/shared/components/ui/button'
import { ChevronDown } from 'lucide-vue-next'
import { cn } from '@renderer/shared/utils/style'

const props = defineProps<{
  icon: FunctionalComponent
  label: string
  collapsed?: boolean
}>()

const emits = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <div class="relative w-full pt-2 flex flex-row items-center">
    <div
      :class="
        cn(
          'w-full h-8',
          'transition-opacity duration-200 ease-[cubic-bezier(.16,1,.3,1)]',
          'opacity-0 text-sidebar-foreground/55 dark:text-sidebar-foreground/45',
          'group-has-[*]/sidebar-expanded:opacity-100 group-hover/sidebar-collapsed:opacity-100'
        )
      "
    >
      <Button
        variant="ghost"
        :class="cn('flex flex-row items-center w-full h-full px-4.5 rounded-none', 'duration-0')"
        @click="emits('click', $event)"
      >
        <span class="flex-1 truncate text-xs text-left">
          {{ props.label }}
        </span>
        <div class="flex items-center justify-center size-4">
          <ChevronDown class="size-4" />
        </div>
      </Button>
    </div>
    <div
      :class="
        cn(
          'absolute left-7 size-4',
          'transition-opacity duration-200 ease-[cubic-bezier(.16,1,.3,1)]',
          'opacity-100 text-sidebar-foreground/55 dark:text-sidebar-foreground/45',
          'group-has-[*]/sidebar-expanded:opacity-0 group-hover/sidebar-collapsed:opacity-0'
        )
      "
    >
      <component :is="props.icon" class="size-full" />
    </div>
  </div>
</template>

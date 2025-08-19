<script setup lang="ts">
import type { FunctionalComponent } from 'vue'
import { Button } from '@renderer/shared/components/ui/button'
import { ChevronDown } from 'lucide-vue-next'
import { cn } from '@renderer/shared/utils/style'

const props = defineProps<{
  icon: FunctionalComponent
  label: string
  collapsed: boolean
}>()
</script>

<template>
  <div class="w-full pt-2">
    <Button
      variant="ghost"
      :class="
        cn(
          'flex flex-row items-center w-full h-8 px-5 rounded-none',
          'text-sidebar-foreground/55 dark:text-sidebar-foreground/45'
        )
      "
    >
      <!-- <div class="flex items-center justify-center size-4">
        <component :is="props.icon" class="size-full" />
      </div> -->
      <span class="flex-1 truncate text-xs text-left">
        {{ props.label }}
      </span>
      <div class="flex items-center justify-center size-4">
        <ChevronDown class="size-4" />
      </div>
    </Button>
  </div>
</template>

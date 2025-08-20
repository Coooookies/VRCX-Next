<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import { SearchIcon, XIcon } from 'lucide-vue-next'
import { Button } from '@renderer/shared/components/ui/button'
import { Input } from '@renderer/shared/components/ui/input'

const value = defineModel<string>('modelValue', {
  default: ''
})
</script>

<template>
  <div
    :class="
      cn(
        'relative invisible',
        'opacity-0 transition-all duration-200 ease-[cubic-bezier(.16,1,.3,1)]',
        'group-has-[*]/sidebar-expanded:opacity-100 group-hover/sidebar-collapsed:opacity-100',
        'group-has-[*]/sidebar-expanded:visible group-hover/sidebar-collapsed:visible'
      )
    "
  >
    <Input
      v-model="value"
      placeholder="Search"
      class="relative w-full h-9 pr-9 border-transparent dark:bg-input/55 placeholder:text-sidebar-foreground/35"
    />
    <div
      :class="
        cn(
          'absolute right-2 top-1/2 -translate-y-1/2 size-6',
          'flex items-center justify-center pointer-events-none'
        )
      "
    >
      <SearchIcon v-if="value.length === 0" class="size-3.5 text-muted-foreground" />
      <Button
        v-else
        size="icon"
        variant="ghost"
        class="size-full rounded-sm pointer-events-auto"
        @click="value = ''"
      >
        <XIcon class="size-4" />
      </Button>
    </div>
  </div>
</template>

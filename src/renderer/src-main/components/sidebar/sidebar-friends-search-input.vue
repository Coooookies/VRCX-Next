<script setup lang="ts">
import { Input } from '@renderer/shared/components/ui/input'
import { cn } from '@renderer/shared/utils/style'
</script>

<template>
  <Input
    :class="
      cn(
        'relative h-9.5 border-transparent dark:bg-input/55 placeholder:text-sidebar-foreground/35',
        'opacity-0 transition-all duration-200 ease-[cubic-bezier(.16,1,.3,1)]',
        'group-has-[*]/sidebar-expanded:opacity-100 group-hover/sidebar-collapsed:opacity-100'
      )
    "
    placeholder="Search"
  ></Input>
</template>

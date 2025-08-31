<script setup lang="ts">
import { Button } from '@renderer/shared/components/ui/button'
import { cn } from '@renderer/shared/utils/style'
import type { HTMLAttributes } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'secondary'
    class?: HTMLAttributes['class']
    description: string
  }>(),
  {
    variant: 'default'
  }
)
</script>

<template>
  <Button
    :class="cn('text-xs h-6 px-2 rounded-sm', props.class)"
    :variant="props.variant"
    size="sm"
  >
    {{ props.description }}
  </Button>
</template>

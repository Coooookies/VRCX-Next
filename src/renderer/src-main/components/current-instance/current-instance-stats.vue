<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'

const props = defineProps<{
  label: string
  value?: string
}>()
</script>

<template>
  <div
    :class="
      cn(
        'w-full h-15 flex flex-col gap-0.5 justify-center',
        'px-3.5 rounded-md text-left overflow-hidden',
        'bg-linear-to-t from-accent/25 to-accent/50'
      )
    "
  >
    <p class="text-xs text-muted-foreground truncate">{{ props.label }}</p>
    <p class="text-[13px] text-foreground truncate">
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        {{ props.value }}
      </template>
    </p>
  </div>
</template>

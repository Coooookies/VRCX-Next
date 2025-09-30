<script setup lang="ts">
import { Button } from '@renderer/shared/components/ui/button'
import { cn } from '@renderer/shared/utils/style'
</script>

<template>
  <Button
    variant="ghost"
    :class="
      cn(
        'size-6 electron-no-drag text-muted-foreground disabled:text-muted-foreground/50',
        'bg-background/30 backdrop-blur-xl'
      )
    "
  >
    <slot />
  </Button>
</template>

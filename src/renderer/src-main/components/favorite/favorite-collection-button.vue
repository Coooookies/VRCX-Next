<script setup lang="ts">
import { Button } from '@renderer/shared/components/ui/button'
import { cn } from '@renderer/shared/utils/style'
import FavoriteWorldIcon from '@shared/assets/vector/favorite-worlds.svg?component'
</script>

<template>
  <Button
    variant="outline"
    :class="
      cn(
        'px-4.5 py-0 has-[>svg]:px-4.5 h-16 flex flex-row gap-4 justify-start items-center',
        'rounded-md border-x-0 border-b-0 pb-px'
      )
    "
  >
    <FavoriteWorldIcon class="size-6" />
    <div class="text-left">
      <p class="text-sm leading-5">Group2</p>
      <p class="text-xs text-muted-foreground leading-4.5">4/150</p>
    </div>
  </Button>
</template>

<script setup lang="ts">
import { Button } from '@renderer/shared/components/ui/button'
import FavoriteWorldIcon from '@shared/assets/vector/favorite-worlds.svg?component'
</script>

<template>
  <Button
    variant="outline"
    class="px-4 py-0 has-[>svg]:px-4 h-16 flex flex-row gap-4 justify-start items-center"
  >
    <FavoriteWorldIcon class="size-6" />
    <div class="text-left">
      <p class="text-sm leading-5">Group2</p>
      <p class="text-xs text-muted-foreground leading-4.5">4/150</p>
    </div>
  </Button>
</template>

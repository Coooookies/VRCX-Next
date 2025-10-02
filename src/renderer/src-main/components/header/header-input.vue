<script setup lang="ts">
import { Button } from '@renderer/shared/components/ui/button'
import { cn } from '@renderer/shared/utils/style'
import { SearchIcon } from 'lucide-vue-next'
</script>

<template>
  <div class="size-full bg-background/65 rounded-full">
    <Button
      variant="link"
      :class="
        cn(
          'size-full bg-muted/50 hover:bg-muted rounded-full electron-no-drag p-0 !no-underline',
          'backdrop-blur-xl border-t border-t-foreground/5'
        )
      "
    >
      <div class="text-muted-foreground/80 flex flex-row items-center gap-1.5">
        <SearchIcon class="size-3.5" />
        <span class="text-[13px]">Players, Avatars, Worlds</span>
      </div>
    </Button>
  </div>
</template>

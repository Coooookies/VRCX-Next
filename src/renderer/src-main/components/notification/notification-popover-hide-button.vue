<script setup lang="ts">
import { Button } from '@renderer/shared/components/ui/button'
import { XIcon } from 'lucide-vue-next'
</script>

<template>
  <Button
    size="icon"
    variant="ghost"
    class="size-4 rounded-[4px] hidden group-hover/notification-card:flex"
  >
    <XIcon class="size-3.5" />
  </Button>
</template>

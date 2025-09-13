<script setup lang="ts">
import BadgeArrow from '@renderer/shared/components/badge/badge-arrow.vue'
import { Button } from '@renderer/shared/components/ui/button'

const props = defineProps<{
  label: string
  value: string
}>()
</script>

<template>
  <Button
    variant="ghost"
    class="w-full h-10 gap-3 rounded-none p-0 hover:!bg-transparent active:!bg-transparent"
  >
    <div class="flex flex-col gap-0.5 justify-center flex-1 text-left overflow-hidden">
      <p class="text-[13px] text-muted-foreground truncate">{{ props.label }}</p>
      <p class="text-sm text-foreground truncate">{{ props.value }}</p>
    </div>
    <div class="flex items-center w-8">
      <BadgeArrow />
    </div>
  </Button>
</template>

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
    class="w-full h-[unset] gap-3 rounded-none p-0 hover:!bg-transparent active:!bg-transparent"
  >
    <div class="flex flex-col gap-0.5 justify-center flex-1 text-left overflow-hidden">
      <p class="text-[13px] text-muted-foreground truncate pl-0.5">{{ props.label }}</p>
      <p class="text-sm text-foreground truncate pl-0.5">{{ props.value }}</p>
    </div>
    <div class="flex items-center pr-0.5">
      <BadgeArrow class="size-8" />
    </div>
  </Button>
</template>

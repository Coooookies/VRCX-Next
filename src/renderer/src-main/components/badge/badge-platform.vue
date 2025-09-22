<script setup lang="ts">
import { PLATFORM_MAPPING } from '@renderer/shared/constants/platform-mapping'
import { Button } from '@renderer/shared/components/ui/button'
import { WorldPackage } from '@shared/definition/vrchat-worlds'
import { computed } from 'vue'

const props = defineProps<{
  platform: keyof typeof PLATFORM_MAPPING
  package: WorldPackage
}>()

const platformDefinition = computed(() => {
  return PLATFORM_MAPPING[props.platform]
})

const fileSize = computed(() => {
  const sizeInMB = props.package.fileSize / (1024 * 1024)
  return `${sizeInMB.toFixed(2)} MB`
})
</script>

<template>
  <Button variant="ghost" class="px-1 py-0 h-7 !bg-accent/50 gap-0 rounded-[10px]">
    <div class="w-6.5 h-5 bg-background rounded-[6px] flex items-center justify-center">
      <component
        :is="platformDefinition.icon"
        :style="{
          fill: platformDefinition.color,
          color: platformDefinition.color
        }"
        class="size-3.5"
      />
    </div>
    <p class="flex-1 text-center text-xs text-muted-foreground">{{ fileSize }}</p>
  </Button>
</template>

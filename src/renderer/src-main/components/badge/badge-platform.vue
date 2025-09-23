<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@renderer/shared/locale'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@renderer/shared/components/ui/hover-card'
import { Button } from '@renderer/shared/components/ui/button'
import { PLATFORM_MAPPING } from '@renderer/shared/constants/platform-mapping'
import type { WorldPackage } from '@shared/definition/vrchat-worlds'

const { t } = useI18n()

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

const uncompressedFileSize = computed(() => {
  const sizeInMB = props.package.uncompressedFileSize / (1024 * 1024)
  return `${sizeInMB.toFixed(2)} MB`
})
</script>

<template>
  <HoverCard :open-delay="500" :close-delay="0">
    <HoverCardTrigger as-child>
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
    </HoverCardTrigger>
    <HoverCardContent class="w-70">
      <div class="grid gap-4">
        <div class="flex flex-row items-center gap-1.5">
          <component
            :is="platformDefinition.icon"
            :style="{
              fill: platformDefinition.color,
              color: platformDefinition.color
            }"
            class="size-4.5"
          />
          <span class="text-sm font-medium leading-none">{{ t(platformDefinition.label) }}</span>
        </div>
        <div class="grid gap-2">
          <div class="grid grid-cols-5 items-center gap-4 text-xs">
            <span class="col-span-2 text-muted-foreground">解压大小</span>
            <span class="col-span-3">{{ uncompressedFileSize }}</span>
          </div>
          <div class="grid grid-cols-5 items-center gap-4 text-xs">
            <span class="col-span-2 text-muted-foreground">资源版本</span>
            <span class="col-span-3">{{ props.package.assetVersion }}</span>
          </div>
          <div class="grid grid-cols-5 items-center gap-4 text-xs">
            <span class="col-span-2 text-muted-foreground">Unity版本</span>
            <span class="col-span-3">{{ props.package.unityVersion }}</span>
          </div>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>

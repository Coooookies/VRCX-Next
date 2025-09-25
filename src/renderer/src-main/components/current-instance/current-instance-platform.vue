<script setup lang="ts">
import BadgePlatform from '../badge/badge-platform.vue'
import { cn } from '@renderer/shared/utils/style'
import { Platform } from '@shared/definition/vrchat-api-response-replenish'
import type { WorldPlatformPackages } from '@shared/definition/vrchat-worlds'

const props = defineProps<{
  label: string
  platform: WorldPlatformPackages
}>()
</script>

<template>
  <div
    :class="
      cn(
        'w-full h-full flex flex-col gap-1 justify-start flex-1 text-left overflow-hidden',
        '@5xl:h-fit'
      )
    "
  >
    <p class="pl-0.5 text-[13px] text-muted-foreground truncate">{{ props.label }}</p>
    <div :class="cn('grid grid-cols-2 gap-2 items-center', '@5xl:grid-cols-2')">
      <BadgePlatform
        v-if="Platform.Standalonewindows in platform"
        :platform="Platform.Standalonewindows"
        :package="platform[Platform.Standalonewindows]!"
      />
      <BadgePlatform
        v-if="Platform.Android in platform"
        :platform="Platform.Android"
        :package="platform[Platform.Android]!"
      />
      <BadgePlatform
        v-if="Platform.IOS in platform"
        :platform="Platform.IOS"
        :package="platform[Platform.IOS]!"
      />
    </div>
  </div>
</template>

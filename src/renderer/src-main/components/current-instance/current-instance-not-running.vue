<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import InstanceTitleNotRunning from '@shared/assets/vector/instance-title-not-running.svg?component'
import InstancePreviewGameLoginVector from '@shared/assets/vector/instance-preview-game-login.svg?component'
import InstancePreviewRoomStatusVector from '@shared/assets/vector/instance-preview-room-status.svg?component'

const props = defineProps<{
  userName: string
}>()
</script>

<template>
  <div class="relative w-full h-screen flex flex-col items-center justify-center">
    <div class="-space-y-1">
      <p class="text-base text-primary text-center font-semibold">Current Instance</p>
      <InstanceTitleNotRunning />
    </div>
    <hr
      :class="
        cn(
          'bg-gradient-to-r from-transparent via-border to-transparent',
          'h-px border-0 w-160',
          'mt-9 mb-11 @7xl:mt-11 @7xl:mb-13'
        )
      "
    />
    <div class="relative flex flex-row gap-6">
      <div class="space-y-3">
        <div class="flex flex-col items-center">
          <InstancePreviewGameLoginVector
            :class="cn('w-[168px] aspect-[25/16] rounded-lg', 'bg-background ring ring-border/70')"
          />
          <div class="-mt-4 size-8 rounded-full bg-border flex items-center justify-center">
            <span class="text-sm">1</span>
          </div>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-foreground text-center font-semibold">Login your Account</p>
          <p class="text-xs text-muted-foreground text-center">As "{{ props.userName }}"</p>
        </div>
      </div>
      <div class="space-y-3">
        <div class="flex flex-col items-center">
          <InstancePreviewRoomStatusVector
            :class="cn('w-[168px] aspect-[25/16] rounded-lg', 'bg-background ring ring-border/70')"
          />
          <div class="-mt-4 size-8 rounded-full bg-border flex items-center justify-center">
            <span class="text-sm">2</span>
          </div>
        </div>
        <p class="text-sm text-foreground text-center font-semibold">Check room status</p>
      </div>
    </div>
  </div>
</template>

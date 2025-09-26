<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import InstancePreviewGameLoginVector from '@shared/assets/vector/instance-preview-game-login.svg?component'
import InstancePreviewRoomStatusVector from '@shared/assets/vector/instance-preview-room-status.svg?component'
</script>

<template>
  <div class="relative w-full h-screen flex items-center justify-center">
    <div class="relative flex flex-row gap-6">
      <div class="space-y-4">
        <InstancePreviewGameLoginVector
          :class="cn('w-[300px] h-[192px] rounded-xl', 'bg-background ring ring-border/60')"
        />
        <p class="text-base text-foreground text-center font-semibold">Launch your VRChat</p>
      </div>
      <div class="space-y-4">
        <InstancePreviewRoomStatusVector
          :class="cn('w-[300px] h-[192px] rounded-xl', 'bg-background ring ring-border/60')"
        />
        <p class="text-base text-foreground text-center font-semibold">Check room status</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageVRChatContext from '@renderer/shared/components/image-vrchat-context.vue'
import { getLocationLabel } from '@renderer/src-main/composables/sidebar-friends'
import { Button } from '@renderer/shared/components/ui/button'
import { ImageFallback, ImageRoot } from '@renderer/shared/components/ui/image'
import { ImageIcon } from 'lucide-vue-next'
import type { LocationInstance } from '@shared/definition/vrchat-instances'
import { ElapsedTimerText } from '@renderer/shared/components/elapsed-timer'

const props = defineProps<{
  location: LocationInstance
  arrivedAt: Date | null
}>()
</script>

<template>
  <Button variant="outline" class="w-full h-18 flex flex-row items-center gap-2.5 p-2">
    <ImageRoot class="block bg-popover size-14 rounded-[6px] overflow-hidden">
      <ImageVRChatContext
        :key="`${props.location.worldImageFileId}-${props.location.worldImageFileVersion}`"
        :file-id="props.location.worldImageFileId"
        :version="props.location.worldImageFileVersion"
        class="size-full object-cover"
      />
      <ImageFallback class="size-full flex items-center justify-center">
        <ImageIcon class="size-4 text-muted-foreground" />
      </ImageFallback>
    </ImageRoot>
    <div class="grid flex-1 text-left leading-tight gap-px overflow-hidden">
      <p class="font-semibold text-[13px] text-foreground truncate">
        {{ props.location.worldName }}
      </p>
      <p class="text-xs text-muted-foreground truncate">
        {{ getLocationLabel(props.location, false) }}
      </p>
      <ElapsedTimerText
        v-if="props.arrivedAt"
        :start-time="props.arrivedAt"
        class="text-xs text-muted-foreground"
      />
      <span v-else class="text-xs text-muted-foreground">{{ `--:--:--` }}</span>
    </div>
  </Button>
</template>

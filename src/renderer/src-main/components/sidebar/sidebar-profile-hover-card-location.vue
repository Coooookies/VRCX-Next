<script setup lang="ts">
import AreaThumbnailMask from '@shared/assets/vector/area-thumbnail-mask.svg?url'
import ImageVRChatContext from '@renderer/shared/components/image-vrchat-context.vue'
import { useI18n } from '@renderer/shared/locale'
import { getLocationLabel } from '@renderer/src-main/composables/sidebar-friends'
import { ImageIcon } from 'lucide-vue-next'
import { ImageFallback, ImageRoot } from '@renderer/shared/components/ui/image'
import { Button } from '@renderer/shared/components/ui/button'
import { ElapsedTimerText } from '@renderer/shared/components/timer'
import type { LocationInstance } from '@shared/definition/vrchat-instances'
import BadgeArea from '../badge/badge-area.vue'

const { t } = useI18n()
const thumbnailMask = `url("${AreaThumbnailMask}")`

const props = defineProps<{
  location: LocationInstance
  arrivedAt: Date | null
}>()
</script>

<template>
  <Button variant="outline" class="w-full h-18 flex flex-row items-center gap-2.5 p-2">
    <div class="relative size-14">
      <ImageRoot
        class="block bg-popover size-full rounded-[6px] overflow-hidden"
        :style="{
          maskImage: thumbnailMask
        }"
      >
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
      <BadgeArea class="absolute -bottom-0.5 right-0 size-4" :region="props.location.region" />
    </div>
    <div class="grid flex-1 text-left leading-tight gap-px overflow-hidden">
      <p class="font-semibold text-[13px] text-foreground truncate">
        {{ props.location.worldName }}
      </p>
      <p class="text-xs text-muted-foreground truncate">
        {{ getLocationLabel(props.location, false)(t) }}
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

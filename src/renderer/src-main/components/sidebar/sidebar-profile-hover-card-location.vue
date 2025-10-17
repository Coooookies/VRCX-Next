<script setup lang="ts">
import AreaThumbnailMask from '@shared/assets/vector/area-thumbnail-mask.svg?url'
import ImageVRChatContext from '@renderer/shared/components/image-vrchat-context.vue'
import BadgeArea from '../badge/badge-area.vue'
import { useI18n } from '@renderer/shared/locale'
import { getLocationLabel } from '@renderer/src-main/composables/sidebar-friends'
import { ImageIcon } from 'lucide-vue-next'
import { ImageFallback, ImageRoot } from '@renderer/shared/components/ui/image'
import { Skeleton } from '@renderer/shared/components/ui/skeleton'
import { Button } from '@renderer/shared/components/ui/button'
import { ElapsedTimerText } from '@renderer/shared/components/timer'
import type { LocationInstanceOverview } from '@shared/definition/vrchat-instances'

const { t } = useI18n()
const thumbnailMask = `url("${AreaThumbnailMask}")`

const props = defineProps<{
  location: LocationInstanceOverview
}>()
</script>

<template>
  <Button variant="outline" class="w-full h-19 flex flex-row items-center gap-2.5 px-2">
    <div class="relative size-14">
      <ImageRoot
        v-if="props.location.referenceWorld"
        class="block bg-popover size-full rounded overflow-hidden"
        :style="{
          maskImage: thumbnailMask
        }"
      >
        <ImageVRChatContext
          :key="`${props.location.referenceWorld.imageFileId}-${props.location.referenceWorld.imageFileVersion}`"
          :file-id="props.location.referenceWorld.imageFileId"
          :version="props.location.referenceWorld.imageFileVersion"
          :size="128"
          class="size-full object-cover"
        />
        <ImageFallback class="size-full flex items-center justify-center">
          <template #default>
            <ImageIcon class="size-4 text-muted-foreground" />
          </template>
          <template #loading>
            <Skeleton class="size-full rounded" />
          </template>
        </ImageFallback>
      </ImageRoot>
      <BadgeArea
        class="absolute -bottom-0.5 right-0 size-4"
        :region="props.location.instance.region"
      />
    </div>
    <div class="grid flex-1 text-left leading-tight gap-px overflow-hidden">
      <p class="font-semibold text-sm text-foreground truncate">
        {{ props.location.referenceWorld?.worldName || 'Loading' }}
      </p>
      <p class="leading-4 text-xs text-muted-foreground truncate">
        {{ getLocationLabel(props.location, false)(t) }}
      </p>
      <p class="leading-4 text-xs text-muted-foreground">
        <span v-if="props.location.isTraveling">{{ t('instance.traveling') }} - </span>
        <ElapsedTimerText :start-time="props.location.arrivedAt" />
      </p>
    </div>
  </Button>
</template>

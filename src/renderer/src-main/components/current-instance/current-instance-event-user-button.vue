<script setup lang="ts">
import ImageVRChatContext from '@renderer/shared/components/image-vrchat-context.vue'
import { ImageRoot, ImageFallback } from '@renderer/shared/components/ui/image'
import { Button } from '@renderer/shared/components/ui/button'
import { Skeleton } from '@renderer/shared/components/ui/skeleton'
import { CircleUserRoundIcon } from 'lucide-vue-next'
import { cn } from '@renderer/shared/utils/style'

const props = defineProps<{
  userName: string
  iconFileId?: string
  iconFileVersion?: number
}>()
</script>

<template>
  <Button
    variant="secondary"
    :class="
      cn(
        'h-6.5 pl-1.5 pr-2 gap-1.5',
        'bg-sidebar-foreground/5 dark:bg-input/55 hover:bg-sidebar-foreground/10 hover:dark:bg-input/80 active:bg-sidebar-foreground/5 active:dark:!bg-input/40'
      )
    "
  >
    <ImageRoot
      :key="`${props.iconFileId}-${props.iconFileVersion}`"
      class="size-4 rounded-full overflow-hidden"
    >
      <ImageVRChatContext
        v-if="props.iconFileId && props.iconFileVersion"
        :file-id="props.iconFileId"
        :version="props.iconFileVersion"
        :size="32"
        class="size-full object-cover"
        lazy
      />
      <ImageFallback class="size-full bg-muted/50 flex items-center justify-center">
        <template #default>
          <CircleUserRoundIcon class="size-4 text-muted-foreground" />
        </template>
        <template #loading>
          <Skeleton class="size-full" />
        </template>
      </ImageFallback>
    </ImageRoot>
    <span class="text-xs text-muted-foreground">
      {{ props.userName }}
    </span>
  </Button>
</template>

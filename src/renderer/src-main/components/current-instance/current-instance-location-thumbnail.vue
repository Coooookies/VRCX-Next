<script setup lang="ts">
import ImageVRChatContext from '@renderer/shared/components/image-vrchat-context.vue'
import { cn } from '@renderer/shared/utils/style'
import { Skeleton } from '@renderer/shared/components/ui/skeleton'
import { ImageFallback, ImageRoot } from '@renderer/shared/components/ui/image'
import { ImageIcon } from 'lucide-vue-next'
import { Button } from '@renderer/shared/components/ui/button'

const props = defineProps<{
  worldName: string
  authorName: string
  thumbnailFileId: string
  thumbnailFileVersion: number
}>()

const emits = defineEmits<{
  (e: 'click', event: MouseEvent): void
  (e: 'showAuthor', event: MouseEvent): void
}>()
</script>

<template>
  <Button
    :class="
      cn(
        'relative aspect-[4/3] rounded-xl overflow-hidden',
        'hover:!bg-transparent active:!bg-transparent p-0 text-left',
        'after:inset-0 after:absolute after:rounded-xl after:pointer-events-none',
        'dark:after:inset-ring dark:after:inset-ring-foreground/8'
      )
    "
    variant="ghost"
    @click="emits('click', $event)"
  >
    <ImageRoot
      :class="
        cn(
          'w-full h-full after:inset-0 after:absolute',
          'after:bg-gradient-to-t after:from-background/75 after:from-20% after:via-transparent after:to-transparent'
        )
      "
    >
      <ImageVRChatContext
        :file-id="props.thumbnailFileId"
        :version="props.thumbnailFileVersion"
        :size="420"
        class="w-full"
      />
      <ImageFallback class="w-full h-full bg-muted/50 flex items-center justify-center">
        <template #default>
          <ImageIcon class="size-8 text-muted-foreground" />
        </template>
        <template #loading>
          <Skeleton class="size-full" />
        </template>
      </ImageFallback>
    </ImageRoot>
    <div class="absolute left-0 top-0 w-full h-full flex flex-col justify-end">
      <div class="w-full px-5 pb-5 space-y-0.5">
        <p class="text-base font-semibold text-white leading-tight line-clamp-1 truncate">
          {{ props.worldName }}
        </p>
        <Button
          as="a"
          variant="link"
          :class="
            cn(
              'w-fit max-w-full text-xs text-primary mt-0.5 p-0 h-auto',
              'underline-offset-2 line-clamp-1 truncate rounded-none'
            )
          "
          @click.stop="emits('showAuthor', $event)"
        >
          {{ props.authorName }}
        </Button>
      </div>
    </div>
  </Button>
</template>

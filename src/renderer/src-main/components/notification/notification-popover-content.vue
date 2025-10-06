<script setup lang="ts">
import ImageVRChatContext from '@renderer/shared/components/image-vrchat-context.vue'
import { Skeleton } from '@renderer/shared/components/ui/skeleton'
import { ImageFallback, ImageRoot } from '@renderer/shared/components/ui/image'
import { ImageIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import { parseFileUrl } from '@shared/utils/vrchat-url-parser'
import { cn } from '@renderer/shared/utils/style'

const props = defineProps<{
  messageThumbnailUrl?: string | null
  messageContent?: string | null
  messageItalic?: boolean
}>()

const imageFile = computed(() => {
  const file = props.messageThumbnailUrl ? parseFileUrl(props.messageThumbnailUrl) : null
  return file && file.fileId && file.version ? file : null
})
</script>

<template>
  <div v-if="props.messageThumbnailUrl || props.messageContent" class="w-full pb-0.5 space-y-2.5">
    <div v-if="props.messageThumbnailUrl && imageFile" class="w-full pl-14">
      <ImageRoot class="block w-full rounded-sm inset-ring-1 inset-ring-muted/50 overflow-hidden">
        <ImageVRChatContext
          :file-id="imageFile.fileId"
          :version="imageFile.version"
          :size="420"
          class="w-full"
        />
        <ImageFallback class="w-full aspect-[1920/1080] flex items-center justify-center">
          <template #default>
            <ImageIcon class="size-8 text-muted-foreground" />
          </template>
          <template #loading>
            <Skeleton class="size-full" />
          </template>
        </ImageFallback>
      </ImageRoot>
    </div>
    <div v-if="props.messageContent" class="w-full pl-14">
      <p
        :class="
          cn(
            'text-xs text-muted-foreground text-left whitespace-pre-wrap leading-4.5',
            props.messageItalic ? 'italic' : ''
          )
        "
      >
        {{ props.messageContent }}
      </p>
    </div>
  </div>
</template>

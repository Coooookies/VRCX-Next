<script setup lang="ts">
import ImageVRChatContext from '@renderer/shared/components/image-vrchat-context.vue'
import { Button } from '@renderer/shared/components/ui/button'
import { ImageRoot, ImageFallback } from '@renderer/shared/components/ui/image'
import { CheckIcon, CircleUserRoundIcon, TrashIcon } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    userId: string
    userName: string
    displayName: string
    profileIconFileId: string
    profileIconFileVersion: number
    checked?: boolean
  }>(),
  {
    checked: false
  }
)

const emits = defineEmits<{
  (e: 'select'): void
  (e: 'delete'): void
}>()
</script>

<template>
  <div className="flex flex-row h-12 gap-0.5 group/credential">
    <Button
      variant="ghost"
      class="flex justify-normal flex-1 h-full rounded-[6px] px-2 gap-3"
      @click="emits('select')"
    >
      <div className="size-8">
        <div v-if="props.checked" class="w-full h-full flex items-center justify-center">
          <CheckIcon class="size-5" />
        </div>
        <ImageRoot v-else class="block size-8 bg-muted rounded-full overflow-hidden">
          <ImageVRChatContext
            class="size-full object-cover"
            :file-id="props.profileIconFileId"
            :version="props.profileIconFileVersion"
          />
          <ImageFallback class="size-full flex items-center justify-center">
            <CircleUserRoundIcon class="size-4 text-muted-foreground" />
          </ImageFallback>
        </ImageRoot>
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{{ props.displayName }}</span>
        <span className="text-muted-foreground truncate text-xs">{{ props.userName }}</span>
      </div>
    </Button>
    <Button
      variant="ghost"
      size="icon"
      class="w-10 h-full hidden group-hover/credential:flex rounded-[6px]"
      @click="emits('delete')"
    >
      <TrashIcon />
    </Button>
  </div>
</template>

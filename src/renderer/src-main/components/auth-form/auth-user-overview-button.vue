<script setup lang="ts">
import ImageVRChatContext from '@renderer/shared/components/image-vrchat-context.vue'
import { cn } from '@renderer/shared/utils/style'
import { CircleUserRoundIcon } from 'lucide-vue-next'
import { Button } from '@renderer/shared/components/ui/button'
import { ImageRoot, ImageFallback } from '@renderer/shared/components/ui/image'
import type { ButtonProps } from '@renderer/shared/components/ui/button/Button.vue'

const props = withDefaults(
  defineProps<
    ButtonProps & {
      userName: string
      displayName: string
      profileIconFileId?: string
      profileIconFileVersion?: number
    }
  >(),
  {
    variant: 'outline'
  }
)
</script>

<template>
  <Button
    :class="cn('w-full h-14 justify-start px-3 gap-3', props.class)"
    v-bind="props"
    @click="() => {}"
  >
    <ImageRoot class="block size-8 bg-muted rounded-full overflow-hidden">
      <ImageVRChatContext
        v-if="props.profileIconFileId && props.profileIconFileVersion"
        class="size-full object-cover"
        :file-id="props.profileIconFileId"
        :version="props.profileIconFileVersion"
      />
      <ImageFallback class="size-full flex items-center justify-center">
        <CircleUserRoundIcon class="size-4 text-muted-foreground" />
      </ImageFallback>
    </ImageRoot>
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-semibold">{{ props.displayName }}</span>
      <span className="text-muted-foreground truncate text-xs">{{ props.userName }}</span>
    </div>
  </Button>
</template>

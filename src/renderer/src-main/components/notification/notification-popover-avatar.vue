<script setup lang="ts">
import ImageVRChatContext from '@renderer/shared/components/image-vrchat-context.vue'
import { ImageFallback, ImageRoot } from '@renderer/shared/components/ui/image'
import { NotificationSenderType } from '@shared/definition/vrchat-notifications'
import {
  MegaphoneIcon,
  ShieldQuestionMarkIcon,
  UserRoundIcon,
  UsersRoundIcon
} from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    fileId?: string | null
    version?: number | null
    type?: NotificationSenderType
  }>(),
  {
    type: NotificationSenderType.System
  }
)
</script>

<template>
  <ImageRoot class="block size-10 bg-muted rounded-full overflow-hidden">
    <ImageVRChatContext
      v-if="props.fileId && props.version"
      :file-id="props.fileId"
      :version="props.version"
      class="size-full object-cover"
    />
    <ImageFallback class="size-full flex items-center justify-center">
      <UserRoundIcon
        v-if="type === NotificationSenderType.User"
        class="size-4 text-muted-foreground"
      />
      <UsersRoundIcon
        v-else-if="type === NotificationSenderType.Group"
        class="size-4 text-muted-foreground"
      />
      <MegaphoneIcon
        v-else-if="type === NotificationSenderType.System"
        class="size-4 text-muted-foreground"
      />
      <ShieldQuestionMarkIcon
        v-else-if="type === NotificationSenderType.Unknown"
        class="size-4 text-muted-foreground"
      />
    </ImageFallback>
  </ImageRoot>
</template>

<script setup lang="ts">
import InstanceOwnerIcon from '@shared/assets/vector/instance-owner.svg?component'
import InstanceFriendIcon from '@shared/assets/vector/instance-friend.svg?component'
import ImageVRChatContext from '@renderer/shared/components/image-vrchat-context.vue'
import { computed } from 'vue'
import { CircleUserRoundIcon } from 'lucide-vue-next'
import { ImageRoot, ImageFallback } from '@renderer/shared/components/ui/image'
import { Skeleton } from '@renderer/shared/components/ui/skeleton'

const props = defineProps<{
  fileId?: string
  version?: number
  isFriend?: boolean
  isOwner?: boolean
}>()

const maskImage = computed(() => {
  if (props.isOwner) {
    return 'var(--mask-instance-owner-avatar)'
  } else if (props.isFriend) {
    return 'var(--mask-instance-friend-avatar)'
  } else {
    return 'none'
  }
})
</script>

<template>
  <div class="relative size-6">
    <div class="relative size-full rounded-full overflow-hidden" :style="{ maskImage }">
      <ImageRoot
        v-if="props.fileId && props.version"
        :key="`${props.fileId}-${props.version}`"
        class="size-full"
      >
        <ImageVRChatContext
          :file-id="props.fileId"
          :version="props.version"
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
      <Skeleton v-else class="size-full" />
    </div>
    <div class="absolute -bottom-0.5 -right-0.5 size-3">
      <InstanceOwnerIcon v-if="props.isOwner" class="size-full text-amber-300" />
      <InstanceFriendIcon v-else-if="props.isFriend" class="size-full text-green-400" />
    </div>
  </div>
</template>

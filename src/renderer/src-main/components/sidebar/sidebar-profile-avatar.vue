<script setup lang="ts">
import ImageVRChatContext from '@renderer/shared/components/image-vrchat-context.vue'
import PhoneIcon from '@shared/assets/vector/profile-icon-phone.svg?component'
import { computed } from 'vue'
import { CircleUserRoundIcon } from 'lucide-vue-next'
import { Skeleton } from '@renderer/shared/components/ui/skeleton'
import { ImageRoot, ImageFallback } from '@renderer/shared/components/ui/image'
import { Platform, UserStatus } from '@shared/definition/vrchat-api-response'
import { cn } from '@renderer/shared/utils/style'

const props = defineProps<{
  showBadge?: boolean
  fileId: string
  version: number
  status: UserStatus
  platform: Platform
}>()

const isPhone = computed(() => {
  return props.platform === Platform.Android
})

const UserStatusTextColors: Record<UserStatus, string> = {
  [UserStatus.Offline]: 'text-gray-600',
  [UserStatus.Active]: 'text-emerald-500',
  [UserStatus.AskMe]: 'text-amber-600',
  [UserStatus.Busy]: 'text-rose-700',
  [UserStatus.JoinMe]: 'text-sky-400'
}

const UserStatusBackgroundColors: Record<UserStatus, string> = {
  [UserStatus.Offline]: 'bg-gray-600',
  [UserStatus.Active]: 'bg-emerald-500',
  [UserStatus.AskMe]: 'bg-amber-600',
  [UserStatus.Busy]: 'bg-rose-700',
  [UserStatus.JoinMe]: 'bg-sky-400'
}
</script>

<template>
  <div class="relative size-9">
    <ImageRoot
      :style="{
        maskImage: props.showBadge
          ? isPhone
            ? 'var(--mask-phone-avatar)'
            : 'var(--mask-status-avatar)'
          : 'none'
      }"
      class="block size-full rounded-full overflow-hidden"
    >
      <ImageVRChatContext
        :key="`${props.fileId}-${props.version}`"
        :file-id="props.fileId"
        :version="props.version"
        class="size-full object-cover"
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
    <template v-if="props.showBadge">
      <PhoneIcon
        v-if="isPhone"
        :class="cn('absolute -right-0.5 bottom-0 size-3', UserStatusTextColors[props.status])"
      />
      <div
        v-else
        :class="
          cn(
            'absolute right-0 bottom-0 size-2 rounded-full',
            UserStatusBackgroundColors[props.status]
          )
        "
      />
    </template>
  </div>
</template>

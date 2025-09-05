<script setup lang="ts">
import ImageVRChatContext from '@renderer/shared/components/image-vrchat-context.vue'
import SidebarProfileHoverCardStatus from './sidebar-profile-hover-card-status.vue'
import SidebarProfileHoverCardLanguages from './sidebar-profile-hover-card-languages.vue'
import SidebarProfileHoverCardLocation from './sidebar-profile-hover-card-location.vue'
import BadgeVRChatPlus from '../badge/badge-vrchat-plus.vue'
import BadgeTrustRank from '../badge/badge-trust-rank.vue'
import { computed } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import { CircleUserRoundIcon, ImageIcon } from 'lucide-vue-next'
import { ImageFallback, ImageRoot } from '@renderer/shared/components/ui/image'
import { Skeleton } from '@renderer/shared/components/ui/skeleton'
import { HoverCardContent } from '@renderer/shared/components/ui/hover-card'
import { UserLanguage, UserTrustRank } from '@shared/definition/vrchat-users'
import { UserStatus } from '@shared/definition/vrchat-api-response'
import type { HoverCardContentProps } from 'reka-ui'
import type { LocationInstanceSummary } from '@shared/definition/vrchat-instances'

const props = defineProps<{
  displayName: string
  profileIconFileId: string
  profileIconFileVersion: number
  profileBackgroundFileId: string
  profileBackgroundFileVersion: number
  bio: string
  isSupporter: boolean
  status: UserStatus
  statusDescription: string
  trustRank: UserTrustRank
  languages: UserLanguage[]
  location: LocationInstanceSummary | null
  locationArrivedAt: Date | null
  isTraveling: boolean
  displayAlign: HoverCardContentProps['align']
}>()

const isSameThumbnail = computed(() => {
  return (
    props.profileIconFileId === props.profileBackgroundFileId &&
    props.profileIconFileVersion === props.profileBackgroundFileVersion
  )
})
</script>

<template>
  <HoverCardContent
    :align="props.displayAlign"
    :align-offset="-48"
    :side-offset="8"
    :collision-padding="8"
    update-position-strategy="optimized"
    class="relative w-85 p-0 rounded-lg"
    side="left"
    disable-update-on-layout-shift
  >
    <ImageRoot
      :class="
        cn('absolute left-1.5 top-1.5 right-1.5 h-36', 'bg-muted/20 rounded-sm overflow-hidden')
      "
    >
      <ImageVRChatContext
        :key="`${props.profileBackgroundFileId}-${props.profileIconFileVersion}`"
        :file-id="props.profileBackgroundFileId"
        :version="props.profileIconFileVersion"
        :size="360"
        :class="cn('size-full object-cover', isSameThumbnail ? 'opacity-40' : 'opacity-100')"
      />
      <ImageFallback class="size-full flex items-center justify-center">
        <template #default>
          <ImageIcon class="size-10 text-muted-foreground opacity-10" />
        </template>
        <template #loading>
          <Skeleton class="size-full" />
        </template>
      </ImageFallback>
    </ImageRoot>
    <div class="relative px-5 pb-5 pt-27">
      <div class="w-full">
        <ImageRoot
          class="block size-20 rounded-full bg-popover overflow-hidden ring-4 ring-popover"
        >
          <ImageVRChatContext
            :key="`${props.profileIconFileId}-${props.profileIconFileVersion}`"
            :file-id="props.profileIconFileId"
            :version="props.profileIconFileVersion"
            :size="128"
            class="size-full object-cover"
          />
          <ImageFallback class="size-full flex items-center justify-center">
            <template #default>
              <CircleUserRoundIcon class="size-7 text-muted-foreground" />
            </template>
            <template #loading>
              <Skeleton class="size-full bg-muted/50" />
            </template>
          </ImageFallback>
        </ImageRoot>
      </div>
      <div class="w-full mt-4 overflow-hidden space-y-0.5">
        <h3 class="text-lg leading-6 font-bold truncate">{{ props.displayName }}</h3>
        <SidebarProfileHoverCardStatus
          :status="props.status"
          :status-description="props.statusDescription"
        />
      </div>
      <div class="w-full mt-4 flex flex-row gap-1">
        <BadgeTrustRank :trust-rank="props.trustRank" />
        <BadgeVRChatPlus v-if="props.isSupporter" />
      </div>
      <div v-if="props.bio" class="w-full mt-4 max-h-9 overflow-hidden">
        <p class="text-xs text-muted-foreground leading-[1.5] line-clamp-2">{{ props.bio }}</p>
      </div>
      <div v-if="props.languages.length > 0" class="w-full mt-6 space-y-1.5">
        <p class="text-xs text-foreground">语言</p>
        <SidebarProfileHoverCardLanguages :languages="props.languages" />
      </div>
      <div v-if="props.location" class="w-full mt-6 space-y-1.5">
        <p class="text-xs text-foreground">位置</p>
        <SidebarProfileHoverCardLocation
          :location="props.location"
          :is-traveling="props.isTraveling"
          :arrived-at="props.locationArrivedAt"
        />
      </div>
    </div>
  </HoverCardContent>
</template>

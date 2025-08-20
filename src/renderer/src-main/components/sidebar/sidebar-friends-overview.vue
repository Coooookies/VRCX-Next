<script setup lang="ts">
import SidebarProfileName from './sidebar-profile-name.vue'
import SidebarProfileAvatar from './sidebar-profile-avatar.vue'
import SidebarProfileStatusLocation from './sidebar-profile-status-location.vue'
import SidebarProfileStatusDescription from './sidebar-profile-status-description.vue'
import SidebarProfileStatusTimer from './sidebar-profile-status-timer.vue'
import { computed } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import { Button } from '@renderer/shared/components/ui/button'
import { Platform, UserStatus } from '@shared/definition/vrchat-api-response'
import type { FriendInformation } from '@shared/definition/vrchat-friends'

const props = defineProps<{
  user: FriendInformation
  showElapsedTimer?: boolean
}>()

const showBadge = computed(() => {
  return props.user.platform !== Platform.Web && props.user.status !== UserStatus.Offline
})
</script>

<template>
  <div class="h-14">
    <Button
      v-if="props.user"
      variant="ghost"
      class="w-full h-14 items-center justify-start px-4.5 gap-2.5 rounded-none duration-0"
    >
      <SidebarProfileAvatar
        :file-id="props.user.profileIconFileId"
        :version="props.user.profileIconFileVersion"
        :platform="props.user.platform"
        :status="props.user.status"
        :show-badge="showBadge"
      />
      <div
        :class="
          cn(
            'grid flex-1 text-left text-sm leading-tight gap-y-px',
            'opacity-0 transition-opacity duration-200 ease-[cubic-bezier(.16,1,.3,1)]',
            'group-has-[*]/sidebar-expanded:opacity-100 group-hover/sidebar-collapsed:opacity-100'
          )
        "
      >
        <SidebarProfileName
          :user-name="props.user.displayName"
          :trust-rank="props.user.trustRank"
        />
        <SidebarProfileStatusTimer
          v-if="props.showElapsedTimer"
          :arrived-at="props.user.locationArrivedAt"
        />
        <template v-else-if="props.user.status !== UserStatus.Offline">
          <SidebarProfileStatusLocation
            v-if="props.user.platform !== Platform.Web"
            :location="props.user.location"
            :is-traveling="props.user.isTraveling"
          />
          <SidebarProfileStatusDescription v-else :description="props.user.statusDescription" />
        </template>
      </div>
    </Button>
  </div>
</template>

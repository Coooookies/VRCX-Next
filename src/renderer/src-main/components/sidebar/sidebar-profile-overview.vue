<script setup lang="ts">
import SidebarProfileName from './sidebar-profile-name.vue'
import SidebarProfileAvatar from './sidebar-profile-avatar.vue'
import SidebarProfileStatusLocation from './sidebar-profile-status-location.vue'
import SidebarProfileStatusDescription from './sidebar-profile-status-description.vue'
import SidebarProfileOverviewSkeleton from './sidebar-profile-overview-skeleton.vue'
import { capitalize } from 'lodash'
import { cn } from '@renderer/shared/utils/style'
import { Button } from '@renderer/shared/components/ui/button'
import type { UserInformation, UserLocation } from '@shared/definition/vrchat-users'

const props = defineProps<{
  user: UserInformation | null
  location: UserLocation | null
}>()
</script>

<template>
  <div class="h-14">
    <Button
      v-if="props.user"
      variant="ghost"
      class="w-full h-14 items-center justify-start pl-4.5 pr-6.5 gap-2.5 rounded-none duration-0"
    >
      <SidebarProfileAvatar
        :file-id="props.user.profileIconFileId"
        :version="props.user.profileIconFileVersion"
        :platform="props.user.platform"
        :status="props.user.status"
        show-badge
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
        <SidebarProfileStatusLocation
          v-if="location"
          :location="location.location"
          :is-traveling="location.isTraveling"
        />
        <SidebarProfileStatusDescription
          v-else
          :description="props.user.statusDescription || capitalize(props.user.status)"
        />
      </div>
    </Button>
    <SidebarProfileOverviewSkeleton v-else />
  </div>
</template>

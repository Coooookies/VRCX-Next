<script setup lang="ts">
import SidebarProfileName from './sidebar-profile-name.vue'
import SidebarProfileAvatar from './sidebar-profile-avatar.vue'
import SidebarProfileStatusLocation from './sidebar-profile-status-location.vue'
import SidebarProfileStatusText from './sidebar-profile-status-text.vue'
import SidebarProfileOverviewSkeleton from './sidebar-profile-overview-skeleton.vue'
import SidebarProfileHoverCard from './sidebar-profile-hover-card.vue'
import SidebarFriendsContextMenu from './sidebar-friends-context-menu.vue'
import { ref } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import { useI18n } from '@renderer/shared/locale'
import { Button } from '@renderer/shared/components/ui/button'
import { HoverCard, HoverCardTrigger } from '@renderer/shared/components/ui/hover-card'
import { ContextMenu, ContextMenuTrigger } from '@renderer/shared/components/ui/context-menu'
import { STATUS_TRANSLATE_KEY } from '@renderer/shared/constants/locate-mapping'
import type { CurrentUserInformation, UserLocation } from '@shared/definition/vrchat-users'

const { t } = useI18n()
const openMenu = ref(false)
const props = defineProps<{
  user: CurrentUserInformation | null
  location: UserLocation | null
}>()

const emits = defineEmits<{
  (e: 'contextMenuOpenChange', open: boolean): void
}>()
</script>

<template>
  <div class="h-14">
    <ContextMenu
      v-if="props.user"
      v-model:open="openMenu"
      @update:open="emits('contextMenuOpenChange', $event)"
    >
      <ContextMenuTrigger>
        <HoverCard :open-delay="500" :close-delay="100">
          <HoverCardTrigger as-child>
            <Button
              variant="ghost"
              :class="
                cn(
                  'w-full h-14 items-center justify-start pl-4.5 pr-6.5 gap-2.5 rounded-none duration-0',
                  openMenu && 'bg-accent/50 dark:bg-accent/30'
                )
              "
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
                <SidebarProfileStatusText
                  v-else
                  :text="props.user.statusDescription || t(STATUS_TRANSLATE_KEY[props.user.status])"
                />
              </div>
            </Button>
          </HoverCardTrigger>
          <SidebarProfileHoverCard
            v-bind="{
              displayName: props.user.displayName,
              profileIconFileId: props.user.profileIconFileId,
              profileIconFileVersion: props.user.profileIconFileVersion,
              profileBackgroundFileId: props.user.profileBackgroundFileId,
              profileBackgroundFileVersion: props.user.profileBackgroundFileVersion,
              bio: props.user.bio,
              isSupporter: props.user.isSupporter,
              status: props.user.status,
              statusDescription: props.user.statusDescription,
              trustRank: props.user.trustRank,
              languages: props.user.languages,
              location: location?.location || null,
              locationArrivedAt: location?.locationArrivedAt || null,
              isTraveling: location?.isTraveling || false
            }"
            display-align="start"
          />
        </HoverCard>
      </ContextMenuTrigger>
      <SidebarFriendsContextMenu />
    </ContextMenu>
    <SidebarProfileOverviewSkeleton v-else />
  </div>
</template>

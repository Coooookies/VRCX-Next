<script setup lang="ts">
import ProfileNameParagraph from '@renderer/shared/components/paragraph/profile-name-paragraph.vue'
import SidebarProfileAvatar from './sidebar-profile-avatar.vue'
import SidebarProfileStatusLocation from './sidebar-profile-status-location.vue'
import SidebarProfileStatusText from './sidebar-profile-status-text.vue'
import SidebarProfileStatusTimer from './sidebar-profile-status-timer.vue'
import SidebarProfileHoverCard from './sidebar-profile-hover-card.vue'
import SidebarFriendsContextMenu from './sidebar-friends-context-menu.vue'
import { ref, computed } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import { useI18n } from '@renderer/shared/locale'
import { Button } from '@renderer/shared/components/ui/button'
import { UserState } from '@shared/definition/vrchat-api-response'
import { HoverCard, HoverCardTrigger } from '@renderer/shared/components/ui/hover-card'
import { ContextMenu, ContextMenuTrigger } from '@renderer/shared/components/ui/context-menu'
import type { FriendInformation } from '@shared/definition/vrchat-friends'

const { t } = useI18n()
const openMenu = ref(false)
const props = defineProps<{
  user: FriendInformation
  showElapsedTimer?: boolean
}>()

const showBadge = computed(() => {
  return props.user.state === UserState.Online
})

const emits = defineEmits<{
  (e: 'contextMenuOpenChange', open: boolean): void
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <ContextMenu v-model:open="openMenu" @update:open="emits('contextMenuOpenChange', $event)">
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
            @click="emits('click', $event)"
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
              <ProfileNameParagraph
                class="font-semibold"
                :user-name="props.user.displayName"
                :trust-rank="props.user.trustRank"
              />
              <template v-if="props.showElapsedTimer">
                <SidebarProfileStatusText
                  v-if="props.user.location?.isTraveling"
                  :text="t('instance.traveling')"
                  shiny
                />
                <SidebarProfileStatusTimer
                  v-else
                  :arrived-at="props.user.location?.arrivedAt || null"
                />
              </template>
              <template v-else-if="props.user.state === UserState.Active">
                <SidebarProfileStatusText :text="props.user.statusDescription" />
              </template>
              <template v-else-if="props.user.state === UserState.Online">
                <SidebarProfileStatusLocation :location="props.user.location" />
              </template>
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
            state: props.user.state,
            status: props.user.status,
            statusDescription: props.user.statusDescription,
            trustRank: props.user.trustRank,
            languages: props.user.languages,
            location: props.user.location
          }"
          display-align="start"
        />
      </HoverCard>
    </ContextMenuTrigger>
    <SidebarFriendsContextMenu />
  </ContextMenu>
</template>

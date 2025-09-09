<script setup lang="ts">
import ProfileAvatarImageStatusMask from '@shared/assets/vector/profile-avatar-image-status-mask.svg?url'
import ProfileAvatarImagePhoneMask from '@shared/assets/vector/profile-avatar-image-phone-mask.svg?url'
import ExpandRightIcon from '@shared/assets/vector/navigator-icon-expand-right.svg?component'
import CollapseRightIcon from '@shared/assets/vector/navigator-icon-collapse-right.svg?component'
import SidebarContainer from './sidebar-container.vue'
import SidebarIconButton from './sidebar-icon-button.vue'
import SidebarProfileOverview from './sidebar-profile-overview.vue'
import SidebarFriends from './sidebar-friends.vue'
import SidebarFriendsSearchInput from './sidebar-friends-search-input.vue'
import SidebarFriendsAction from './sidebar-friends-action.vue'
import { cn } from '@renderer/shared/utils/style'
import { computed, ref } from 'vue'
import { useModule } from '@renderer/shared/hooks/use-module'
import { useSidebarFriends } from '@renderer/src-main/composables/sidebar-friends'
import type { SidebarContainerProps, SidebarStateEmits, SidebarStateProps } from './types'
import type { VRChatUsers } from '@renderer/shared/modules/vrchat-users'

const expanded = defineModel<boolean>('expanded')
const users = useModule<VRChatUsers>('VRChatUsers')
const props = defineProps<SidebarContainerProps & SidebarStateProps>()
const emits = defineEmits<SidebarStateEmits>()

const { virtualFriends, searchModelValue, isLoading, toggleCollapse } = useSidebarFriends()
const notificationPopoverVisible = ref(false)
const overviewMenuOpened = ref(false)
const friendsMenuOpened = ref(false)

const statusMask = `url("${ProfileAvatarImageStatusMask}")`
const phoneMask = `url("${ProfileAvatarImagePhoneMask}")`

const focus = computed(() => {
  return (
    searchModelValue.value.length > 0 ||
    notificationPopoverVisible.value ||
    overviewMenuOpened.value ||
    friendsMenuOpened.value
  )
})

const handleOverviewMenuOpenChange = (open: boolean) => {
  overviewMenuOpened.value = open
}

const handleFriendsMenuOpenChange = (open: boolean) => {
  friendsMenuOpened.value = open
}

console.log(emits)
</script>

<template>
  <SidebarContainer
    v-bind="props"
    v-model:expanded="expanded"
    v-model:focus="focus"
    :class="
      cn(
        'right-0 border-l border-transparent',
        expanded
          ? 'border-sidebar-border/40 bg-background'
          : [
              focus
                ? 'border-sidebar-border/40 bg-background/80'
                : 'hover:border-sidebar-border/40 hover:bg-background/80 group/sidebar-right'
            ]
      )
    "
    :style="{
      '--mask-status-avatar': statusMask,
      '--mask-phone-avatar': phoneMask
    }"
  >
    <div
      :class="
        cn(
          'absolute top-0 left-0 w-full h-full backdrop-blur-2xl',
          'transition-opacity duration-200 ease-[cubic-bezier(.16,1,.3,1)]',
          focus ? 'opacity-100' : 'opacity-0 group-hover/sidebar-right:opacity-100'
        )
      "
    />
    <div class="absolute top-0 left-0 w-[var(--expand-width)] h-full flex flex-col">
      <div :class="cn('w-full h-10', expanded ? 'electron-drag' : 'electron-no-drag')" />
      <div class="w-full">
        <SidebarProfileOverview
          class="w-full"
          :user="users.state.user"
          :location="users.state.location"
          @context-menu-open-change="handleOverviewMenuOpenChange"
        />
      </div>
      <div class="flex flex-row gap-2 px-4 pt-2 pb-1.5">
        <SidebarFriendsAction v-model:notification-visible="notificationPopoverVisible" />
        <SidebarFriendsSearchInput v-model="searchModelValue" class="flex-1" />
      </div>
      <div class="flex-1 w-full h-0">
        <SidebarFriends
          class="w-full h-full"
          :friends="virtualFriends"
          :is-loading="isLoading"
          @toggle-collapse="toggleCollapse"
          @item-context-menu-open-change="handleFriendsMenuOpenChange"
        />
      </div>
      <div
        :class="
          cn(
            'py-2.5 border-t border-transparent transition-colors duration-200 ease-in-out',
            'group-hover/sidebar-collapsed:border-sidebar-border/40 group-has-[*]/sidebar-expanded:border-sidebar-border/40'
          )
        "
      >
        <SidebarIconButton
          :icon="expanded ? CollapseRightIcon : ExpandRightIcon"
          :label="expanded ? 'Collapse' : 'Expand'"
          @click="expanded = !expanded"
        />
      </div>
    </div>
  </SidebarContainer>
</template>

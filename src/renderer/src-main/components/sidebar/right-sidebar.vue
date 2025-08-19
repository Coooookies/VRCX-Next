<script setup lang="ts">
import ExpandRightIcon from '@shared/assets/vector/navigator-icon-expand-right.svg?component'
import CollapseRightIcon from '@shared/assets/vector/navigator-icon-collapse-right.svg?component'

import SidebarContainer from './sidebar-container.vue'
import SidebarIconButton from './sidebar-icon-button.vue'
import SidebarFriends from './sidebar-friends.vue'
import SidebarFriendsSearchInput from './sidebar-friends-search-input.vue'
import SidebarFriendsAction from './sidebar-friends-action.vue'
import { cn } from '@renderer/shared/utils/style'
import type { SidebarContainerProps, SidebarStateEmits, SidebarStateProps } from './types'

const expanded = defineModel<boolean>('expanded')
const props = defineProps<SidebarContainerProps & SidebarStateProps>()
const emits = defineEmits<SidebarStateEmits>()

console.log(emits)
</script>

<template>
  <SidebarContainer
    v-bind="props"
    v-model:expanded="expanded"
    :class="
      cn(
        'right-0 border-l border-transparent',
        expanded
          ? 'border-sidebar-border/40 bg-background'
          : 'hover:border-sidebar-border/40 hover:bg-background/80 group/sidebar-right'
      )
    "
  >
    <div
      :class="
        cn(
          'absolute top-0 left-0 w-full h-full backdrop-blur-2xl',
          'transition-opacity duration-200 ease-[cubic-bezier(.16,1,.3,1)]',
          'opacity-0 group-hover/sidebar-right:opacity-100'
        )
      "
    />
    <div class="absolute top-0 left-0 w-[var(--expand-width)] h-full flex flex-col">
      <div :class="cn('w-full h-10', expanded ? 'electron-drag' : 'electron-no-drag')" />
      <div class="flex flex-row gap-2 px-4 pt-1.5 pb-1">
        <SidebarFriendsAction />
        <SidebarFriendsSearchInput class="flex-1" />
      </div>
      <div class="flex-1 w-full">
        <SidebarFriends class="w-full h-full" />
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

<script setup lang="ts">
import ExpandLeftIcon from '@shared/assets/vector/navigator-icon-expand-left.svg?component'
import CollapseLeftIcon from '@shared/assets/vector/navigator-icon-collapse-left.svg?component'
import DashboardIcon from '@shared/assets/vector/navigator-icon-dashboard.svg?component'
import FavoriteIcon from '@shared/assets/vector/navigator-icon-favorite.svg?component'
import FeedIcon from '@shared/assets/vector/navigator-icon-feed.svg?component'
import ChartIcon from '@shared/assets/vector/navigator-icon-chart.svg?component'
import SettingIcon from '@shared/assets/vector/navigator-icon-setting.svg?component'

import SidebarContainer from './sidebar-container.vue'
import SidebarIconButton from './sidebar-icon-button.vue'
import SidebarTitle from './sidebar-title.vue'
import { computed } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import type { SidebarContainerProps, SidebarStateEmits, SidebarStateProps } from './types'

const expanded = defineModel<boolean>('expanded')
const props = defineProps<SidebarContainerProps & SidebarStateProps>()
const emits = defineEmits<SidebarStateEmits>()

const isActiveRoute = (name: string) => {
  return name.startsWith(props.activeRouteName)
}

const sidebarCommonItems = computed(() => {
  const base = [
    {
      icon: DashboardIcon,
      label: 'Dashboard',
      routeName: 'page-app-dashboard'
    },
    {
      icon: FavoriteIcon,
      label: 'Favorites',
      routeName: 'page-app-favorites'
    },
    {
      icon: FeedIcon,
      label: 'Feed',
      routeName: 'page-app-feed'
    },
    {
      icon: ChartIcon,
      label: 'Charts',
      routeName: 'page-app-charts'
    }
  ]

  return base
})

const sidebarFooterItems = computed(() => [
  {
    icon: SettingIcon,
    label: 'Settings',
    routeName: 'page-app-settings'
  }
])
</script>

<template>
  <SidebarContainer
    v-bind="props"
    v-model:expanded="expanded"
    class="left-0 bg-sidebar border-r border-sidebar-border dark:border-sidebar-border/40 flex flex-col"
  >
    <div class="flex-1">
      <div :class="cn('pt-3', expanded ? 'electron-drag' : 'electron-no-drag')">
        <SidebarTitle />
      </div>
      <div class="pt-4 flex flex-col gap-1.5">
        <SidebarIconButton
          v-for="item in sidebarCommonItems"
          :key="item.routeName"
          :icon="item.icon"
          :label="item.label"
          :active="isActiveRoute(item.routeName)"
          @click="emits('update:activeRouteName', item.routeName)"
        />
      </div>
    </div>
    <div class="pb-2.5">
      <div class="pt-4 flex flex-col gap-1.5">
        <SidebarIconButton
          v-for="item in sidebarFooterItems"
          :key="item.routeName"
          :icon="item.icon"
          :label="item.label"
          :active="isActiveRoute(item.routeName)"
          @click="emits('update:activeRouteName', item.routeName)"
        />
      </div>
    </div>
    <div class="py-2.5 border-t border-sidebar-border dark:border-sidebar-border/40">
      <SidebarIconButton
        :icon="expanded ? CollapseLeftIcon : ExpandLeftIcon"
        :label="expanded ? 'Collapse' : 'Expand'"
        @click="expanded = !expanded"
      />
    </div>
  </SidebarContainer>
</template>

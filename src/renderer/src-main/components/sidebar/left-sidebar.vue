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
import type { SidebarContainerProps } from './types'

const expanded = defineModel<boolean>('expanded')
const props = defineProps<SidebarContainerProps>()
</script>

<template>
  <SidebarContainer
    v-bind="props"
    v-model:expanded="expanded"
    class="left-0 bg-sidebar border-r border-sidebar-border dark:border-sidebar-border/40"
  >
    <div class="flex-1 pt-2.5">
      <SidebarTitle />
      <div class="pt-2 flex flex-col gap-1.5">
        <SidebarIconButton :icon="DashboardIcon" label="Dashboard" active />
        <SidebarIconButton :icon="FavoriteIcon" label="Favorite" />
        <SidebarIconButton :icon="FeedIcon" label="Feed" />
        <SidebarIconButton :icon="ChartIcon" label="Chart" />
      </div>
    </div>
    <div class="pb-2">
      <SidebarIconButton :icon="SettingIcon" label="Setting" />
    </div>
    <div class="py-2 border-t border-sidebar-border dark:border-sidebar-border/40">
      <SidebarIconButton
        :icon="expanded ? CollapseLeftIcon : ExpandLeftIcon"
        :label="expanded ? '收起' : '展开'"
        @click="expanded = !expanded"
      />
    </div>
  </SidebarContainer>
</template>

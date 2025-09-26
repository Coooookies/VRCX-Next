<script setup lang="ts">
// import ExpandLeftIcon from '@shared/assets/vector/navigator-icon-expand-left.svg?component'
// import CollapseLeftIcon from '@shared/assets/vector/navigator-icon-collapse-left.svg?component'
import DashboardIcon from '@shared/assets/vector/navigator-icon-dashboard.svg?component'
import FavoriteIcon from '@shared/assets/vector/navigator-icon-favorite.svg?component'
import FeedIcon from '@shared/assets/vector/navigator-icon-feed.svg?component'
import ChartIcon from '@shared/assets/vector/navigator-icon-chart.svg?component'
import SettingIcon from '@shared/assets/vector/navigator-icon-setting.svg?component'

import SidebarContainer from './sidebar-container.vue'
import SidebarCurrentInstance from './sidebar-current-instance.vue'
import SidebarIconButton from './sidebar-icon-button.vue'
import SidebarTitle from './sidebar-title.vue'
import { computed } from 'vue'
import { useI18n } from '@renderer/shared/locale'
import { cn } from '@renderer/shared/utils/style'
import type { SidebarContainerProps, SidebarStateEmits, SidebarStateProps } from './types'

const { t } = useI18n()

const expanded = defineModel<boolean>('expanded')
const props = defineProps<SidebarContainerProps & SidebarStateProps>()
const emits = defineEmits<SidebarStateEmits>()

const isActiveRoute = (name: string) => {
  return props.activeRouteName.startsWith(name)
}

const sidebarCommonItems = computed(() => {
  const base = [
    {
      icon: DashboardIcon,
      label: t('sidebar.dashboard'),
      routeName: 'page-app-dashboard'
    },
    {
      icon: FavoriteIcon,
      label: t('sidebar.favorites'),
      routeName: 'page-app-favorites'
    },
    {
      icon: FeedIcon,
      label: t('sidebar.feed'),
      routeName: 'page-app-feed'
    },
    {
      icon: ChartIcon,
      label: t('sidebar.charts'),
      routeName: 'page-app-charts'
    }
  ]

  return base
})

const sidebarFooterItems = computed(() => [
  {
    icon: SettingIcon,
    label: t('sidebar.settings'),
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
    <div class="pt-4 pb-3.5 flex flex-col gap-1.5">
      <SidebarCurrentInstance
        :active="isActiveRoute('page-app-current-instance')"
        @click="emits('update:activeRouteName', 'page-app-current-instance')"
      />
      <!-- <div class="flex flex-col gap-1.5"></div> -->
    </div>
    <div class="py-2.5 border-t border-sidebar-border dark:border-sidebar-border/40">
      <SidebarIconButton
        v-for="item in sidebarFooterItems"
        :key="item.routeName"
        :icon="item.icon"
        :label="item.label"
        :active="isActiveRoute(item.routeName)"
        @click="emits('update:activeRouteName', item.routeName)"
      />
    </div>
    <!-- <div class="py-2.5 border-t border-sidebar-border dark:border-sidebar-border/40">
      <SidebarIconButton
        :icon="expanded ? CollapseLeftIcon : ExpandLeftIcon"
        :label="t(expanded ? 'sidebar.collapse' : 'sidebar.expand')"
        @click="expanded = !expanded"
      />
    </div> -->
  </SidebarContainer>
</template>

<script setup lang="ts">
import ExpandRightIcon from '@shared/assets/vector/navigator-icon-expand-right.svg?component'
import CollapseRightIcon from '@shared/assets/vector/navigator-icon-collapse-right.svg?component'

import SidebarContainer from './sidebar-container.vue'
import SidebarIconButton from './sidebar-icon-button.vue'
import { cn } from '@renderer/shared/utils/style'
import type { SidebarContainerProps } from './types'

const expanded = defineModel<boolean>('expanded')
const props = defineProps<SidebarContainerProps>()
</script>

<template>
  <SidebarContainer
    v-bind="props"
    v-model:expanded="expanded"
    :class="cn('right-0 hover:bg-sidebar', expanded ? 'bg-sidebar' : 'hover:bg-sidebar')"
  >
    <div class="flex-1"></div>
    <div class="py-2 border-t border-sidebar-border/40">
      <SidebarIconButton
        :icon="expanded ? CollapseRightIcon : ExpandRightIcon"
        :label="expanded ? '收起' : '展开'"
        @click="expanded = !expanded"
      />
    </div>
  </SidebarContainer>
</template>

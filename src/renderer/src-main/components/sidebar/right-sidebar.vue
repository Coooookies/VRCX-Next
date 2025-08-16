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
    :class="
      cn(
        'right-0 border-l border-transparent ',
        expanded
          ? 'border-sidebar-border/40 bg-background'
          : 'hover:border-sidebar-border/40 hover:bg-background'
      )
    "
  >
    <div class="flex-1"></div>
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
  </SidebarContainer>
</template>

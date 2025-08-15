<script setup lang="ts">
import SidebarContainer from './sidebar-container.vue'
import { cn } from '@renderer/shared/utils/style'
import { Button } from '@renderer/shared/components/ui/button'
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
    <Button @click="expanded = !expanded">toggle</Button>
  </SidebarContainer>
</template>

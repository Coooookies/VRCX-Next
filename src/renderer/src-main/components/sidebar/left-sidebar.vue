<script setup lang="ts">
import { Button } from '@renderer/shared/components/ui/button'
import SidebarContainer from './sidebar-container.vue'
import type { SidebarContainerProps } from './types'

const expanded = defineModel<boolean>('expanded')
const props = defineProps<SidebarContainerProps>()
</script>

<template>
  <SidebarContainer
    v-bind="props"
    v-model:expanded="expanded"
    class="left-0 bg-sidebar border-r border-sidebar-border/40"
  >
    <Button @click="expanded = !expanded">toggle</Button>
  </SidebarContainer>
</template>

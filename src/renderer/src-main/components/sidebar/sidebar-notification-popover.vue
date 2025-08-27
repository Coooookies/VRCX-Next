<script setup lang="ts">
import { Popover, PopoverTrigger } from '@renderer/shared/components/ui/popover'
import SidebarNotificationPopover from './sidebar-notification-popover-card.vue'

const open = defineModel<boolean>('open', {
  default: false
})
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger>
      <slot />
    </PopoverTrigger>
    <SidebarNotificationPopover />
  </Popover>
</template>

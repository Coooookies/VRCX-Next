<script setup lang="ts">
import MessageIcon from '@shared/assets/vector/navigator-icon-message.svg?component'
import FriendsIcon from '@shared/assets/vector/navigator-icon-friends.svg?component'
import SidebarFriendsIconButton from './sidebar-friends-icon-button.vue'
import { cn } from '@renderer/shared/utils/style'
</script>

<template>
  <div class="flex flex-row gap-px">
    <SidebarFriendsIconButton
      :icon="MessageIcon"
      label="Messages"
      class="group-has-[*]/sidebar-expanded:rounded-r-none group-hover/sidebar-collapsed:rounded-r-none"
    />
    <div
      :class="
        cn(
          'opacity-0 transition-opacity duration-200 ease-[cubic-bezier(.16,1,.3,1)]',
          'group-has-[*]/sidebar-expanded:opacity-100 group-hover/sidebar-collapsed:opacity-100'
        )
      "
    >
      <SidebarFriendsIconButton :icon="FriendsIcon" label="Friends" class="rounded-l-none" />
    </div>
  </div>
</template>

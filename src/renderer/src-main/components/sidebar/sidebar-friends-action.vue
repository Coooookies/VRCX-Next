<script setup lang="ts">
import MessageIcon from '@shared/assets/vector/navigator-icon-message.svg?component'
import FriendsIcon from '@shared/assets/vector/navigator-icon-friends.svg?component'
import SidebarFriendsIconButton from './sidebar-friends-icon-button.vue'
import SidebarNotificationPopover from './sidebar-notification-popover.vue'
import { cn } from '@renderer/shared/utils/style'
import { useI18n } from '@renderer/shared/locale'

const { t } = useI18n()
const notificationVisible = defineModel<boolean>('notificationVisible', {
  default: false
})
</script>

<template>
  <div class="flex flex-row gap-px">
    <div>
      <SidebarNotificationPopover v-model:open="notificationVisible">
        <SidebarFriendsIconButton
          :icon="MessageIcon"
          :label="t('sidebar.notifications')"
          class="group-has-[*]/sidebar-expanded:rounded-r-none group-hover/sidebar-collapsed:rounded-r-none"
        />
      </SidebarNotificationPopover>
    </div>
    <div
      :class="
        cn(
          'opacity-0 invisible transition-[opacity,visibility] duration-200 ease-[cubic-bezier(.16,1,.3,1)]',
          'group-has-[*]/sidebar-expanded:opacity-100 group-hover/sidebar-collapsed:opacity-100',
          'group-has-[*]/sidebar-expanded:visible group-hover/sidebar-collapsed:visible'
        )
      "
    >
      <SidebarFriendsIconButton
        :icon="FriendsIcon"
        :label="t('sidebar.friends_manage')"
        class="rounded-l-none"
      />
    </div>
  </div>
</template>

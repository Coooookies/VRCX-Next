<script setup lang="ts">
import MessageIcon from '@shared/assets/vector/navigator-icon-message.svg?component'
import FriendsIcon from '@shared/assets/vector/navigator-icon-friends.svg?component'
import SidebarActionIconMask from '@shared/assets/vector/sidebar-action-icon-mask.svg?url'
import SidebarFriendsIconButton from './sidebar-friends-icon-button.vue'
import SidebarNotificationPopover from './sidebar-notification-popover.vue'
import { Popover, PopoverTrigger } from '@renderer/shared/components/ui/popover'

import { computed } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import { useI18n } from '@renderer/shared/locale'
import { useSidebarNotifications } from '@renderer/src-main/composables/sidebar-notifications'
import { useModule } from '@renderer/shared/hooks/use-module'
import { useSidebarNotificationsSubmit } from '@renderer/src-main/composables/sidebar-notifications-submit'
import type { VRChatUsers } from '@renderer/shared/modules/vrchat-users'

const { t } = useI18n()
const { categories, isLoading, isUnread } = useSidebarNotifications()
const {
  markNotificationV1AsRead,
  respondNotificationV2,
  deleteNotificationV1,
  deleteNotificationV2
} = useSidebarNotificationsSubmit()

const users = useModule<VRChatUsers>('VRChatUsers')
const actionIconMask = `url("${SidebarActionIconMask}")`
const notificationVisible = defineModel<boolean>('notificationVisible', {
  default: false
})

const isSupporter = computed(() => {
  return users.state.user?.isSupporter || false
})
</script>

<template>
  <div
    class="flex flex-row gap-px"
    :style="{
      '--mask-sidebar-action-icon': actionIconMask
    }"
  >
    <div>
      <Popover v-model:open="notificationVisible">
        <PopoverTrigger>
          <SidebarFriendsIconButton
            :icon="MessageIcon"
            :hotspot="isUnread"
            :label="t('sidebar.notifications')"
            class="group-has-[*]/sidebar-expanded:rounded-r-none group-hover/sidebar-collapsed:rounded-r-none"
          />
        </PopoverTrigger>
        <SidebarNotificationPopover
          :categories="categories"
          :is-supporter="isSupporter"
          :is-loading="isLoading"
          @read-notification-v1="markNotificationV1AsRead"
          @hide-notification-v1="deleteNotificationV1"
          @hide-notification-v2="deleteNotificationV2"
          @respond-notification-v2="respondNotificationV2"
        />
      </Popover>
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

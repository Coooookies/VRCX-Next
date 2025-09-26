<script setup lang="ts">
import MessageIcon from '@shared/assets/vector/navigator-icon-message.svg?component'
import FriendsIcon from '@shared/assets/vector/navigator-icon-friends.svg?component'
import SidebarActionIconMask from '@shared/assets/vector/sidebar-action-icon-mask.svg?url'
import SidebarFriendsIconButton from './sidebar-friends-icon-button.vue'
import SidebarNotificationPopover from './sidebar-notification-popover.vue'
import { Popover, PopoverTrigger } from '@renderer/shared/components/ui/popover'

import { computed } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import { toast } from 'vue-sonner'
import { useI18n } from '@renderer/shared/locale'
import { useSidebarNotifications } from '@renderer/src-main/composables/sidebar-notifications'
import { useModule } from '@renderer/shared/hooks/use-module'
import { useSidebarNotificationsSubmit } from '@renderer/src-main/composables/sidebar-notifications-submit'
import type { VRChatUsers } from '@renderer/shared/modules/vrchat-users'

const { t } = useI18n()
const { categories, isLoading, isUnread } = useSidebarNotifications()
const {
  markNotificationAsRead,
  respondNotificationV2,
  deleteNotificationV1,
  deleteNotificationV2,
  acceptInvite,
  responseInvite,
  responseInviteWithMessage,
  responseInviteWithPhoto,
  acceptFriendRequest,
  declineFriendRequest
} = useSidebarNotificationsSubmit({
  onRespondNotificationV2(_, __, ___, promise) {
    toast.promise(promise, {
      loading: t('toast.processing.vrcapi_notification_reponse_processing'),
      success: t('toast.resolve.vrcapi_notification_v2_respond_success')
    })
  },
  onDeleteNotificationV1(_, promise) {
    toast.promise(promise, {
      loading: t('toast.processing.vrcapi_notification_reponse_processing'),
      success: t('toast.resolve.vrcapi_notification_clear_success')
    })
  },
  onDeleteNotificationV2(_, promise) {
    toast.promise(promise, {
      loading: t('toast.processing.vrcapi_notification_reponse_processing'),
      success: t('toast.resolve.vrcapi_notification_clear_success')
    })
  },
  onClearNotifications(promise) {
    toast.promise(promise, {
      loading: t('toast.processing.vrcapi_notification_reponse_processing'),
      success: t('toast.resolve.vrcapi_notification_clear_success')
    })
  },
  onAcceptInvite(_, promise) {
    toast.promise(promise, {
      loading: t('toast.processing.vrcapi_notification_reponse_processing'),
      success: t('toast.resolve.vrcapi_notification_v1_accept_invite_success')
    })
  },
  onResponseInvite(_, promise) {
    toast.promise(promise, {
      loading: t('toast.processing.vrcapi_notification_reponse_processing'),
      success: t('toast.resolve.vrcapi_notification_v1_decline_invite_success')
    })
  },
  onResponseInviteWithMessage(_, promise) {
    toast.promise(promise, {
      loading: t('toast.processing.vrcapi_notification_reponse_processing'),
      success: t('toast.resolve.vrcapi_notification_v1_decline_invite_with_message_success')
    })
  },
  onResponseInviteWithPhoto(_, promise) {
    toast.promise(promise, {
      loading: t('toast.processing.vrcapi_notification_reponse_processing'),
      success: t('toast.resolve.vrcapi_notification_v1_decline_invite_with_photo_success')
    })
  },
  onAcceptFriendRequest(_, promise) {
    toast.promise(promise, {
      loading: t('toast.processing.vrcapi_notification_reponse_processing'),
      success: t('toast.resolve.vrcapi_notification_v1_accept_friend_request_success')
    })
  },
  onDeclineFriendRequest(_, promise) {
    toast.promise(promise, {
      loading: t('toast.processing.vrcapi_notification_reponse_processing'),
      success: t('toast.resolve.vrcapi_notification_v1_decline_friend_request_success')
    })
  }
})

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
        <PopoverTrigger as-child>
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
          :respond-notification-v2="respondNotificationV2"
          :respond-invite="responseInvite"
          :respond-invite-with-message="responseInviteWithMessage"
          :respond-invite-with-photo="responseInviteWithPhoto"
          :accept-invite="acceptInvite"
          :accept-friend-request="acceptFriendRequest"
          :decline-friend-request="declineFriendRequest"
          @read-notification-v1="markNotificationAsRead"
          @read-notification-v2="markNotificationAsRead"
          @hide-notification-v1="deleteNotificationV1"
          @hide-notification-v2="deleteNotificationV2"
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

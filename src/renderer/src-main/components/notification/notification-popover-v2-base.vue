<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import { useI18n } from '@renderer/shared/locale'
import { useAsyncState } from '@vueuse/core'
import {
  NotificationGlobalType,
  NotificationSenderType
} from '@shared/definition/vrchat-notifications'
import { Button } from '@renderer/shared/components/ui/button'
import { Spinner } from '@renderer/shared/components/ui/spinner'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@renderer/shared/components/ui/hover-card'
import { NOTIFICATION_V2_RESPONSE_TEXTKEY } from '@renderer/shared/constants/locate-mapping'
import type { NotificationBaseProps } from './types'
import type { NotificationGlobalRawInformation } from '@shared/definition/vrchat-notifications'
import type { NotificationV2ResponseType } from '@shared/definition/vrchat-api-response'
import NotificationPopoverAvatar from './notification-popover-avatar.vue'
import NotificationPopoverContent from './notification-popover-content.vue'
import NotificationPopoverActionButton from './notification-popover-action-button.vue'

const { t } = useI18n()

const props = defineProps<{
  base: NotificationBaseProps
  raw: NotificationGlobalRawInformation[NotificationGlobalType]
  type?: NotificationSenderType
  respondNotificationV2: (
    notificationId: string,
    type: NotificationV2ResponseType,
    data: string
  ) => Promise<void>
}>()

const emits = defineEmits<{
  (e: 'readNotificationV2', notificationId: string): void
}>()

const { executeImmediate: respondNotification, isLoading: responsing } = useAsyncState(
  props.respondNotificationV2,
  void 0,
  { immediate: false }
)

const handleFocusNotification = () => {
  if (!props.base.isRead) {
    emits('readNotificationV2', props.base.notificationId)
  }
}

const getActionDescription = (textKey: string | null, title: string) => {
  if (textKey && textKey in NOTIFICATION_V2_RESPONSE_TEXTKEY) {
    return t(NOTIFICATION_V2_RESPONSE_TEXTKEY[textKey])
  }
  return title
}
</script>

<template>
  <Button
    :class="
      cn(
        'group/notification-card',
        'w-full h-[unset] px-5 py-4 cursor-default rounded-none',
        'active:bg-accent dark:active:bg-accent/50 duration-0',
        'border-b border-border/40',
        'flex flex-col items-start gap-2.5',
        props.base.isRead ? 'bg-transparent' : 'bg-accent/20 dark:bg-accent/30'
      )
    "
    variant="ghost"
    @click="handleFocusNotification"
  >
    <div class="w-full h-10 flex flex-row items-center justify-start gap-4">
      <NotificationPopoverAvatar
        :file-id="props.base.senderAvatarFileId"
        :version="props.base.senderAvatarFileVersion"
        :type="props.type"
      />
      <div class="grid flex-1 text-left text-sm leading-tight gap-y-0.5">
        <slot />
      </div>
    </div>
    <NotificationPopoverContent
      :message-thumbnail-url="props.base.thumbnailImageUrl"
      :message-content="props.base.message"
    />
    <div class="flex flex-row items-center justifyD-start gap-1.5 pl-14 pb-0.5">
      <div v-if="responsing" class="h-6 flex items-center justify-center">
        <Spinner class="size-5" />
      </div>
      <template v-else-if="'responses' in props.raw">
        <HoverCard
          v-for="(action, index) in props.raw.responses"
          :key="index"
          :open-delay="500"
          :close-delay="0"
        >
          <HoverCardTrigger as-child>
            <NotificationPopoverActionButton
              size="sm"
              :variant="['accept', 'delete'].includes(action.type) ? 'default' : 'secondary'"
              :description="getActionDescription(action.textKey, action.text)"
              @click.stop="respondNotification(props.base.notificationId, action.type, action.data)"
            />
          </HoverCardTrigger>
          <HoverCardContent class="w-auto px-2 py-1.5 text-xs" side="top" :side-offset="6">
            {{ action.text }}
          </HoverCardContent>
        </HoverCard>
      </template>
    </div>
  </Button>
</template>

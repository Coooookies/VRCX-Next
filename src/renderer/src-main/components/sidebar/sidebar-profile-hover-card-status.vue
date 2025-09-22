<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import { useI18n } from '@renderer/shared/locale'
import { UserStatus } from '@shared/definition/vrchat-api-response'
import { STATUS_TRANSLATE_KEY } from '@renderer/shared/constants/profile-mapping'

const { t } = useI18n()

const props = defineProps<{
  status: UserStatus
  statusDescription?: string
}>()

const UserStatusBackgroundColors: Record<UserStatus, string> = {
  [UserStatus.Offline]: 'bg-gray-600',
  [UserStatus.Active]: 'bg-emerald-500',
  [UserStatus.AskMe]: 'bg-amber-600',
  [UserStatus.Busy]: 'bg-rose-700',
  [UserStatus.JoinMe]: 'bg-sky-400'
}
</script>

<template>
  <div class="flex flex-row gap-1 items-center h-4">
    <div :class="cn('size-2 rounded-full', UserStatusBackgroundColors[props.status])" />
    <span
      :class="
        cn(
          'truncate text-xs',
          props.status === UserStatus.Offline ? 'text-muted-foreground' : 'text-foreground'
        )
      "
      >{{
        props.statusDescription && props.status !== UserStatus.Offline
          ? props.statusDescription
          : t(STATUS_TRANSLATE_KEY[props.status])
      }}</span
    >
  </div>
</template>

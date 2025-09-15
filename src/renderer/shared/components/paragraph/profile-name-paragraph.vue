<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import { UserTrustRank } from '@shared/definition/vrchat-users'
import type { AsTag } from 'reka-ui'

const TrustRankTextColors: Record<UserTrustRank, string> = {
  [UserTrustRank.Visitor]: 'text-white',
  [UserTrustRank.New]: 'text-blue-500',
  [UserTrustRank.User]: 'text-emerald-500',
  [UserTrustRank.Trusted]: 'text-violet-500',
  [UserTrustRank.Known]: 'text-amber-600',
  [UserTrustRank.Troll]: 'text-gray-500',
  [UserTrustRank.Moderator]: 'text-rose-600'
}

const props = withDefaults(
  defineProps<{
    userName: string
    trustRank: UserTrustRank
    as?: AsTag
  }>(),
  {
    as: 'p'
  }
)
</script>

<template>
  <component :is="props.as" :class="cn('truncate', TrustRankTextColors[props.trustRank])">
    {{ props.userName }}
  </component>
</template>

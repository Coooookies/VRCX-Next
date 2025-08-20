<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import { UserTrustRank } from '@shared/definition/vrchat-users'

const TrustRankTextColors: Record<UserTrustRank, string> = {
  [UserTrustRank.Visitor]: 'text-white',
  [UserTrustRank.New]: 'text-blue-500',
  [UserTrustRank.User]: 'text-emerald-500',
  [UserTrustRank.Trusted]: 'text-indigo-500',
  [UserTrustRank.Known]: 'text-amber-600',
  [UserTrustRank.Troll]: 'text-gray-500',
  [UserTrustRank.Moderator]: 'text-rose-600'
}

const props = defineProps<{
  userName: string
  trustRank: UserTrustRank
}>()
</script>

<template>
  <p :class="cn('truncate font-semibold', TrustRankTextColors[props.trustRank])">
    {{ props.userName }}
  </p>
</template>

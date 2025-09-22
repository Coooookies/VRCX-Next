<script setup lang="ts">
import { useI18n } from '@renderer/shared/locale'
import { cn } from '@renderer/shared/utils/style'
import { UserTrustRank } from '@shared/definition/vrchat-users'
import { TRUST_RANK_TRANSLATE_KEY } from '@renderer/shared/constants/profile-mapping'

const { t } = useI18n()

const TrustRankTextColors: Record<UserTrustRank, string> = {
  [UserTrustRank.Visitor]: 'bg-gray-500',
  [UserTrustRank.Troll]: 'bg-gray-400',
  [UserTrustRank.New]: 'bg-blue-500',
  [UserTrustRank.User]: 'bg-emerald-500',
  [UserTrustRank.Trusted]: 'bg-violet-500',
  [UserTrustRank.Known]: 'bg-amber-600',
  [UserTrustRank.Moderator]: 'bg-rose-600'
}

const props = defineProps<{
  trustRank: UserTrustRank
}>()
</script>

<template>
  <div :class="cn('relative px-2 py-0 h-5.5 rounded', TrustRankTextColors[props.trustRank])">
    <span class="block font-medium leading-5.5 text-foreground text-xs">
      {{ t(TRUST_RANK_TRANSLATE_KEY[props.trustRank]) }}
    </span>
  </div>
</template>

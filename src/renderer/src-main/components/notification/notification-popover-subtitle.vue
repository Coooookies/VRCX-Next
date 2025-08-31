<script setup lang="ts">
import { useModule } from '@renderer/shared/hooks/use-module'
import { RelativeTimerText } from '@renderer/shared/components/timer'
import type { VRChatMiscellaneous } from '@renderer/shared/modules/vrchat-miscellaneous'

const misc = useModule<VRChatMiscellaneous>('VRChatMiscellaneous')
const props = defineProps<{
  createdAt: Date
}>()
</script>

<template>
  <p class="text-xs text-muted-foreground capitalize truncate">
    <RelativeTimerText :start-time="props.createdAt" :offset="misc.state.serverTimeOffset" />
  </p>
</template>

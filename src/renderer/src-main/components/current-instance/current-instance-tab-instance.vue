<script setup lang="ts">
import CurrentInstanceStats from './current-instance-stats.vue'
import CurrentInstanceArrowButton from './current-instance-arrow-button.vue'
import { computed } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import { useI18n } from '@renderer/shared/locale'
import { ElapsedTimerText } from '@renderer/shared/components/timer'
import { TabsContent } from '@renderer/shared/components/ui/tabs'
import { LOCATION_TYPE_TRANSLATE_KEY } from '@renderer/shared/constants/locale-mapping'
import type { LocationInstance, LocationOwner } from '@shared/definition/vrchat-instances'

const { t } = useI18n()

const props = defineProps<{
  value: string
  playerCount: number | null
  playerCapacity: number | null
  instanceOwner: LocationOwner | null
  instanceType: LocationInstance['type']
  joinedAt: Date | null
  require18yo: boolean
}>()

const currentInstanceType = computed(() => {
  return t(LOCATION_TYPE_TRANSLATE_KEY[props.instanceType])
})
</script>

<template>
  <TabsContent :value="props.value" :class="cn('px-0.5 flex flex-1 flex-col', '@5xl:flex-[unset]')">
    <div
      v-if="props.instanceOwner && props.instanceOwner?.type !== 'public'"
      :class="
        cn(
          'flex flex-row border-b border-border border-dashed py-0 flex-1 items-center',
          '@5xl:py-5 @5xl:flex-[unset]'
        )
      "
    >
      <CurrentInstanceArrowButton
        v-if="props.instanceOwner.type === 'group'"
        label="Group"
        :value="props.instanceOwner.summary?.groupName || '-'"
      />
      <CurrentInstanceArrowButton
        v-if="props.instanceOwner.type === 'user'"
        label="Owner"
        :value="props.instanceOwner.summary?.displayName || '-'"
      />
    </div>
    <div
      :class="
        cn(
          'grid grid-cols-4 gap-5 py-0 flex-1 items-center',
          '@5xl:grid-cols-2 @5xl:py-5 @5xl:flex-[unset]'
        )
      "
    >
      <CurrentInstanceStats label="In Room">
        <span>{{ props.playerCount || '-' }}</span>
        <span>/</span>
        <span>{{ props.playerCapacity || '-' }}</span>
      </CurrentInstanceStats>
      <CurrentInstanceStats label="Access Type" :value="currentInstanceType" />
      <CurrentInstanceStats label="Join Time">
        <ElapsedTimerText v-if="props.joinedAt" :start-time="props.joinedAt" />
        <span v-else>{{ `--:--:--` }}</span>
      </CurrentInstanceStats>
      <CurrentInstanceStats v-if="require18yo" label="Age Gate" value="18+" />
    </div>
  </TabsContent>
</template>

<script setup lang="ts">
import ShinyText from '@renderer/shared/components/shiny-text.vue'
import CurrentInstanceStats from './current-instance-stats.vue'
import CurrentInstanceStatsSkeleton from './current-instance-stats-skeleton.vue'
import CurrentInstanceArrowButton from './current-instance-arrow-button.vue'
import { computed } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import { useI18n } from '@renderer/shared/locale'
import { ElapsedTimerText } from '@renderer/shared/components/timer'
import { TabsContent } from '@renderer/shared/components/ui/tabs'
import { LocationInstancePublicType } from '@shared/definition/vrchat-instances'
import { LOCATION_TYPE_TRANSLATE_KEY } from '@renderer/shared/constants/locale-mapping'
import type { LocationInstance, LocationOwner } from '@shared/definition/vrchat-instances'

const { t } = useI18n()

const props = defineProps<{
  value: string
  playerCount: number | null
  playerCapacity: number | null
  owner: LocationOwner | null
  instance: LocationInstance | null
  joinedAt: Date | null
  require18yo: boolean
}>()

const currentInstanceType = computed(() => {
  return t(LOCATION_TYPE_TRANSLATE_KEY[props.instance?.type || LocationInstancePublicType.Public])
})

const currentPlayerCount = computed(() => {
  return `${props.playerCount || '-'}/${props.playerCapacity || '-'}`
})
</script>

<template>
  <TabsContent :value="props.value" :class="cn('flex flex-1 flex-col', '@5xl:flex-[unset]')">
    <div
      v-if="props.instance?.type !== LocationInstancePublicType.Public"
      :class="
        cn(
          'flex flex-row border-b border-border border-dashed flex-1 items-center',
          '@5xl:py-5 @5xl:h-20 @5xl:flex-[unset]'
        )
      "
    >
      <CurrentInstanceStatsSkeleton v-if="!props.owner" />
      <CurrentInstanceArrowButton
        v-else-if="props.owner.type === 'group'"
        label="Group"
        :value="props.owner.summary?.groupName || '-'"
      />
      <CurrentInstanceArrowButton
        v-else-if="props.owner.type === 'user'"
        label="Owner"
        :value="props.owner.summary?.displayName || '-'"
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
        <ShinyText
          v-if="props.playerCount === null || props.playerCapacity === null"
          :speed="2"
          :text="currentPlayerCount"
        />
        <span v-else>{{ currentPlayerCount }}</span>
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

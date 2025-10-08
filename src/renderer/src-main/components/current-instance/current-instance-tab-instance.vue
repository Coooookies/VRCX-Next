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
import {
  InstanceAccessCategory,
  LocationInstancePublicType
} from '@shared/definition/vrchat-instances'
import { LOCATION_TYPE_TRANSLATE_KEY } from '@renderer/shared/constants/instance-mapping'
import type { LocationInstance, InstanceOwner } from '@shared/definition/vrchat-instances'

const { t } = useI18n()

const props = defineProps<{
  value: string
  playerCount: number | null
  playerCapacity: number | null
  owner: InstanceOwner | null
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
          'flex flex-row border-b border-border border-dashed py-5 items-center',
          '@5xl:flex-[unset] @5xl:py-5.5'
        )
      "
    >
      <CurrentInstanceStatsSkeleton v-if="!props.owner" />
      <CurrentInstanceArrowButton
        v-else-if="props.owner.type === InstanceAccessCategory.Group"
        label="Group"
        :value="props.owner.summary?.groupName || '-'"
      />
      <CurrentInstanceArrowButton
        v-else-if="props.owner.type === InstanceAccessCategory.Friend"
        label="Owner"
        :value="props.owner.summary?.displayName || '-'"
      />
    </div>
    <div
      :class="
        cn(
          'grid grid-cols-4 gap-5 py-5 items-center',
          '@5xl:grid-cols-2 @5xl:flex-[unset] @5xl:gap-5.5 @5xl:py-5.5'
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

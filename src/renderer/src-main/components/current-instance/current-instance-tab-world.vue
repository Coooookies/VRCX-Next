<script setup lang="ts">
import CurrentInstanceStats from './current-instance-stats.vue'
import CurrentInstanceStatsSkeleton from './current-instance-stats-skeleton.vue'
import CurrentInstanceArrowButton from './current-instance-arrow-button.vue'
import { computed } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import { useI18n } from '@renderer/shared/locale'
import { TabsContent } from '@renderer/shared/components/ui/tabs'
import { RELEASE_STATUS_TRANSLATE_KEY } from '@renderer/shared/constants/locale-mapping'
import type { WorldDetail } from '@shared/definition/vrchat-worlds'

const { t } = useI18n()

const props = defineProps<{
  value: string
  detail: WorldDetail | null
}>()

const worldCapacity = computed(() => {
  return props.detail
    ? `${props.detail.capacity.maxCapacity} (${props.detail.capacity.recommendedCapacity})`
    : '-'
})
</script>

<template>
  <TabsContent :value="props.value" :class="cn('flex flex-1 flex-col', '@5xl:flex-[unset]')">
    <template v-if="props.detail">
      <div
        :class="
          cn(
            'flex flex-row border-b border-border border-dashed flex-1 items-center',
            '@5xl:py-5 @5xl:h-20 @5xl:flex-[unset]'
          )
        "
      >
        <CurrentInstanceArrowButton label="Creator" :value="props.detail.authorUserName" />
      </div>
      <div
        :class="
          cn(
            'grid grid-cols-4 gap-5 py-0 flex-1 items-center',
            '@5xl:grid-cols-2 @5xl:py-5 @5xl:flex-[unset]'
          )
        "
      >
        <CurrentInstanceStats label="Capacity" :value="worldCapacity" />
        <CurrentInstanceStats
          label="Release Status"
          :value="t(RELEASE_STATUS_TRANSLATE_KEY[props.detail.releaseStatus])"
        />
      </div>
    </template>
    <template v-else>
      <div
        :class="
          cn(
            'flex flex-row border-b border-border border-dashed flex-1 items-center',
            '@5xl:py-5 @5xl:h-20 @5xl:flex-[unset]'
          )
        "
      >
        <CurrentInstanceStatsSkeleton />
      </div>
      <div
        :class="
          cn(
            'grid grid-cols-4 gap-5 py-0 flex-1 items-center',
            '@5xl:grid-cols-2 @5xl:py-5 @5xl:flex-[unset]'
          )
        "
      >
        <CurrentInstanceStatsSkeleton />
        <CurrentInstanceStatsSkeleton />
      </div>
    </template>
  </TabsContent>
</template>

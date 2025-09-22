<script setup lang="ts">
import CurrentInstanceStats from './current-instance-stats.vue'
import CurrentInstanceStatsSkeleton from './current-instance-stats-skeleton.vue'
import CurrentInstanceArrowButton from './current-instance-arrow-button.vue'
import CurrentInstancePlatforms from './current-instance-platforms.vue'
import { computed } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import { useI18n } from '@renderer/shared/locale'
import { TabsContent } from '@renderer/shared/components/ui/tabs'
import { RELEASE_STATUS_TRANSLATE_KEY } from '@renderer/shared/constants/instance-mapping'
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
            'flex flex-row border-b border-border border-dashed py-5 items-center',
            '@5xl:flex-[unset]'
          )
        "
      >
        <CurrentInstanceArrowButton label="Creator" :value="props.detail.authorUserName" />
      </div>
      <div
        :class="
          cn(
            'grid grid-cols-4 gap-5 py-5 items-center',
            '@5xl:gap-5 @5xl:grid-cols-2 @5xl:h-fit @5xl:flex-[unset]'
          )
        "
      >
        <CurrentInstanceStats
          class="order-1 @5xl:order-1"
          label="Capacity"
          :value="worldCapacity"
        />
        <CurrentInstanceStats
          class="order-2 @5xl:order-2"
          label="Release Status"
          :value="t(RELEASE_STATUS_TRANSLATE_KEY[props.detail.releaseStatus])"
        />
        <CurrentInstanceStats
          class="order-4 @5xl:order-3"
          label="Release Status"
          :value="t(RELEASE_STATUS_TRANSLATE_KEY[props.detail.releaseStatus])"
        />
        <CurrentInstancePlatforms
          class="order-3 @5xl:order-4 w-full col-span-2 row-span-3 @5xl:row-span-[unset]"
          label="Platform"
          :platform="props.detail.packages"
        />
      </div>
    </template>
    <template v-else>
      <div
        :class="
          cn(
            'flex flex-row border-b border-border border-dashed py-5 items-center',
            '@5xl:flex-[unset]'
          )
        "
      >
        <CurrentInstanceStatsSkeleton />
      </div>
      <div
        :class="
          cn(
            'grid grid-cols-4 gap-5 py-5 items-center',
            '@5xl:gap-5 @5xl:grid-cols-2 @5xl:flex-[unset]'
          )
        "
      >
        <CurrentInstanceStatsSkeleton />
        <CurrentInstanceStatsSkeleton />
      </div>
    </template>
  </TabsContent>
</template>

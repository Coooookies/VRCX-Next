<script setup lang="ts">
import CurrentInstanceArrowButton from './current-instance-arrow-button.vue'
import CurrentInstanceStats from './current-instance-stats.vue'
import CurrentInstanceStatsSkeleton from './current-instance-stats-skeleton.vue'
import CurrentInstancePlatform from './current-instance-platform.vue'
import CurrentInstancePlatformSkeleton from './current-instance-platform-skeleton.vue'
import { computed } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import { useI18n } from '@renderer/shared/locale'
import { TabsContent } from '@renderer/shared/components/ui/tabs'
import { Skeleton } from '@renderer/shared/components/ui/skeleton'
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
  <TabsContent :value="props.value" :class="cn('flex flex-1 flex-col gap-1')">
    <template v-if="props.detail">
      <div :class="cn('flex flex-row py-4 items-center')">
        <CurrentInstanceArrowButton label="Creator" :value="props.detail.authorUserName" />
      </div>
      <div :class="cn('grid grid-cols-2 items-center gap-2')">
        <CurrentInstanceStats
          class="order-1 @5xl:order-1"
          label="Capacity"
          :value="worldCapacity"
        />
        <CurrentInstanceStats
          class="order-2 @5xl:order-2"
          label="Version"
          :value="`${props.detail.version}`"
        />
        <CurrentInstanceStats
          class="order-3 @5xl:order-3"
          label="Release Status"
          :value="t(RELEASE_STATUS_TRANSLATE_KEY[props.detail.releaseStatus])"
        />
      </div>
      <div :class="cn('flex flex-row py-4 items-center')">
        <CurrentInstancePlatform
          class="order-4 @5xl:order-4 w-full col-span-2 row-span-2 @5xl:row-span-[unset]"
          label="Platform"
          :platform="props.detail.packages"
        />
      </div>
    </template>
    <template v-else>
      <div :class="cn('flex flex-row py-4 items-center')">
        <CurrentInstanceStatsSkeleton />
      </div>
      <div :class="cn('grid grid-cols-2 items-center gap-2')">
        <Skeleton class="w-full h-15 rounded-md" />
        <Skeleton class="w-full h-15 rounded-md" />
        <Skeleton class="w-full h-15 rounded-md" />
      </div>
      <div :class="cn('flex flex-row py-4 items-center')">
        <CurrentInstancePlatformSkeleton
          class="order-3 @5xl:order-4 w-full col-span-2 row-span-2 @5xl:row-span-[unset]"
        />
      </div>
    </template>
  </TabsContent>
</template>

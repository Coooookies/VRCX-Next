<script setup lang="ts">
import ShinyText from '@renderer/shared/components/shiny-text.vue'
import BadgeArea from '../badge/badge-area.vue'
import { computed } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import { useI18n } from '@renderer/shared/locale'
import { getLocationLabel } from '@renderer/src-main/composables/sidebar-friends'
import type { LocationInstanceOverview } from '@shared/definition/vrchat-instances'

const { t } = useI18n()

const props = defineProps<{
  location: LocationInstanceOverview | null
}>()

const locationText = computed(() => {
  return props.location ? getLocationLabel(props.location)(t) : ''
})
</script>

<template>
  <div
    :class="
      cn(
        'w-full h-4 flex flex-row gap-1 items-center overflow-hidden',
        'text-xs text-muted-foreground'
      )
    "
  >
    <template v-if="!props.location">
      <span>{{ t('instance.type.private') }}</span>
    </template>
    <template v-else-if="props.location.isTraveling">
      <div class="size-4 shrink-0 flex flex-row items-center">
        <BadgeArea
          :region="props.location.instance.region"
          class="size-3.5 animate-[animation-icon-shiny_2.5s_infinite]"
        />
      </div>
      <ShinyText class="truncate" :text="locationText" :speed="2" />
    </template>
    <template v-else>
      <div class="size-4 shirnk-0 flex flex-row items-center">
        <BadgeArea :region="props.location.instance.region" class="size-3.5" />
      </div>
      <span class="truncate">{{ locationText }}</span>
    </template>
  </div>
</template>

<style>
@keyframes animation-icon-shiny {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}
</style>

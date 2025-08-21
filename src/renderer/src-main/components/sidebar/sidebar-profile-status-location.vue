<script setup lang="ts">
import ShinyText from '@renderer/shared/components/shiny-text.vue'
import AreaJP from '@shared/assets/vector/area-jp.svg?component'
import AreaUSA from '@shared/assets/vector/area-usa.svg?component'
import AreaEU from '@shared/assets/vector/area-eu.svg?component'
import AreaUnknown from '@shared/assets/vector/area-unknown.svg?component'
import { computed } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import { useI18n } from '@renderer/shared/locale'
import { getLocationLabel } from '@renderer/src-main/composables/sidebar-friends'
import { Region } from '@shared/definition/vrchat-api-response'
import type { UserLocation } from '@shared/definition/vrchat-users'

const { t } = useI18n()

const props = defineProps<{
  isTraveling: UserLocation['isTraveling']
  location: UserLocation['location']
}>()

const locationText = computed(() => {
  return props.location ? getLocationLabel(props.location) : ''
})

const locationArea = computed(() => {
  const location = props.location
  if (!location) {
    return AreaUnknown
  }

  switch (location.region) {
    case Region.Jp:
      return AreaJP
    case Region.Us:
    case Region.Use:
    case Region.Usw:
    case Region.Usx:
      return AreaUSA
    case Region.Eu:
      return AreaEU
    default:
      return AreaUnknown
  }
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
      <span>{{ t('profile.instance_type.private') }}</span>
    </template>
    <template v-else-if="props.isTraveling">
      <div class="size-4 flex items-center justify-center">
        <component :is="locationArea" class="size-3.5 animate-[animation-icon-shiny_2s_infinite]" />
      </div>
      <ShinyText class="truncate" :text="locationText" :speed="2" />
    </template>
    <template v-else>
      <div class="size-4 flex items-center justify-center">
        <component :is="locationArea" class="size-3.5" />
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

<script setup lang="ts">
import AreaJP from '@shared/assets/vector/area-jp.svg?component'
import AreaUSA from '@shared/assets/vector/area-usa.svg?component'
import AreaEU from '@shared/assets/vector/area-eu.svg?component'
import AreaUnknown from '@shared/assets/vector/area-unknown.svg?component'
import { Region } from '@shared/definition/vrchat-api-response'
import { computed } from 'vue'

const props = defineProps<{
  region?: Region
}>()

const locationArea = computed(() => {
  if (!props.region) {
    return AreaUnknown
  }

  switch (props.region) {
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
  <component :is="locationArea" />
</template>

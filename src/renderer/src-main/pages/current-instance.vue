<script setup lang="ts">
import AppRoute from '../layouts/app-route.vue'
import CurrentInstanceInfoTabs from '../components/current-instance/current-instance-info-tabs.vue'
import CurrentInstanceLocationThumbnail from '../components/current-instance/current-instance-location-thumbnail.vue'
import CurrentInstancePageTabs from '../components/current-instance/current-instance-page-tabs.vue'
import CurrentInstanceSearchInput from '../components/current-instance/current-instance-search-input.vue'
import CurrentInstanceTabInstance from '../components/current-instance/current-instance-tab-instance.vue'
import CurrentInstanceTabWorld from '../components/current-instance/current-instance-tab-world.vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cn } from '@renderer/shared/utils/style'
import { useCurrentInstance } from '../composables/current-instance'
import { RouterView } from 'vue-router'
import { Tabs } from '@renderer/shared/components/ui/tabs'
import { LocationInstanceGroupType } from '@shared/definition/vrchat-instances'
import type { CurrentInstanceInfoTab } from '../components/current-instance/current-instance-info-tabs.vue'
import type { CurrentInstancePageTab } from '../components/current-instance/current-instance-page-tabs.vue'

const router = useRouter()
const route = useRoute()
const { instancePlayers, instance, isGameRunning, isInstanceLoading, isJoined } =
  useCurrentInstance()

const infoTabs: CurrentInstanceInfoTab[] = [
  { value: 'info-room', label: 'Room' },
  { value: 'info-world', label: 'World' }
]

const pageTabs: CurrentInstancePageTab[] = [
  { value: 'page-app-current-instance.players', label: 'Players' },
  { value: 'page-app-current-instance.events', label: 'Event History' }
]

const currentLocation = computed(() => instance.currentInstance.locationInstance)
const currentWorld = computed(() => instance.currentInstance.world)
const require18yo = computed(() => {
  if (
    currentLocation.value?.type === LocationInstanceGroupType.Group ||
    currentLocation.value?.type === LocationInstanceGroupType.GroupPlus ||
    currentLocation.value?.type === LocationInstanceGroupType.GroupPublic
  ) {
    return currentLocation.value.require18yo
  }

  return false
})

const routeName = computed(() => route.name?.toString() || '')
const routeTo = (name: string) => {
  if (routeName.value !== name) {
    router.push({ name })
  }
}

const isInstancePreloading = computed(() => {
  return isInstanceLoading.value && instancePlayers.value.length === 0
})
</script>

<template>
  <AppRoute>
    <div class="@container w-full">
      <template v-if="isGameRunning">
        <div
          v-if="isJoined"
          :class="
            cn(
              'relative flex flex-col mx-auto gap-8 w-full px-10',
              '@7xl:w-300 @7xl:px-0',
              '@5xl:flex-row'
            )
          "
        >
          <div
            :class="
              cn('relative w-full pt-21 h-fit z-2', '@5xl:sticky @5xl:top-0 @5xl:w-64', '@7xl:w-70')
            "
          >
            <div :class="cn('h-12 flex flex-row items-center', '@5xl:h-9')">
              <p :class="cn('font-semibold text-2xl', '@5xl:text-lg')">Location</p>
            </div>
            <div :class="cn('flex h-48 mt-4 flex-row gap-8', '@5xl:flex-col @5xl:gap-4')">
              <CurrentInstanceLocationThumbnail
                :detail="currentWorld"
                :class="cn('w-[unset] h-full', '@5xl:w-full @5xl:h-[unset]')"
              />
              <Tabs :default-value="infoTabs[0].value" class="size-full gap-0">
                <CurrentInstanceInfoTabs :class="cn('w-1/2', '@5xl:w-full')" :tabs="infoTabs" />
                <CurrentInstanceTabInstance
                  :value="infoTabs[0].value"
                  :instance="currentLocation"
                  :owner="instance.currentInstance.locationOwner"
                  :player-count="!isInstancePreloading ? instancePlayers.length : null"
                  :player-capacity="currentWorld?.capacity.maxCapacity || null"
                  :joined-at="instance.currentInstance.locationJoinedAt"
                  :require18yo="require18yo"
                />
                <CurrentInstanceTabWorld
                  :value="infoTabs[1].value"
                  :detail="instance.currentInstance.world"
                />
              </Tabs>
            </div>
          </div>
          <div :class="cn('relative w-full pb-10 -mt-21', '@5xl:mt-0 @5xl:w-[unset] @5xl:flex-1')">
            <div class="sticky top-0 z-1 pt-21 pb-4 bg-background">
              <div class="flex flex-row justify-between h-9 pl-1">
                <CurrentInstancePageTabs
                  :tabs="pageTabs"
                  :model-value="routeName"
                  @update:model-value="routeTo"
                />
                <CurrentInstanceSearchInput class="w-46 h-full" />
              </div>
            </div>
            <div>
              <RouterView />
            </div>
          </div>
        </div>
        <div v-else class="w-full h-screen flex items-center justify-center">
          <p>1</p>
        </div>
      </template>
      <template v-else>
        <div class="w-full h-screen flex items-center justify-center">
          <p>2</p>
        </div>
      </template>
    </div>
  </AppRoute>
</template>

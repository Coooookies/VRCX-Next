<script setup lang="ts">
import AppRoute from '../layouts/app-route.vue'
import { computed } from 'vue'
import { useModule } from '@renderer/shared/hooks/use-module'
import { Spinner } from '@renderer/shared/components/ui/spinner'
import type { VRChatInstances } from '@renderer/shared/modules/vrchat-instances'
import type { ServiceMonitor } from '@renderer/shared/modules/service-monitor'

const service = useModule<ServiceMonitor>('ServiceMonitor')
const instance = useModule<VRChatInstances>('VRChatInstances')

const intanceJson = computed(() => {
  return instance.trackerState.locationInstance
    ? JSON.stringify(instance.trackerState.locationInstance, null, 2)
    : 'null'
})

const ownerJson = computed(() => {
  return instance.trackerState.ownerDetail
    ? JSON.stringify(instance.trackerState.ownerDetail, null, 2)
    : 'null'
})

const worldJson = computed(() => {
  return instance.trackerState.worldDetail
    ? JSON.stringify(instance.trackerState.worldDetail, null, 2)
    : 'null'
})

const usersJson = computed(() => {
  return JSON.stringify(instance.currentInstancePlayers.value, null, 2)
})

const activitiesJson = computed(() => {
  return JSON.stringify(instance.currentInstanceEvents.value, null, 2)
})
</script>

<template>
  <AppRoute>
    <div class="px-10 py-10 space-y-6">
      <div class="bg-white/5 p-4 rounded-md">
        <p>{{ service.state.vrchat.isRunning }}</p>
        <p>{{ service.state.vrchat.pid }}</p>
        <p>{{ service.state.vrchat.cmd }}</p>
      </div>
      <div class="bg-white/5 p-4 rounded-md">
        <p>{{ service.state.steamvr.isRunning }}</p>
        <p>{{ service.state.steamvr.pid }}</p>
        <p>{{ service.state.steamvr.cmd }}</p>
      </div>
      <div class="bg-white/5 p-4 rounded-md">
        <p>{{ instance.trackerState.recordId }}</p>
        <p>{{ instance.trackerState.isJoined }}</p>
        <p class="whitespace-pre-wrap text-xs">{{ intanceJson }}</p>
        <Spinner v-if="instance.trackerState.isInitializing" class="size-5" />
      </div>
      <div class="bg-white/5 p-4 rounded-md">
        <p class="whitespace-pre-wrap text-xs">{{ ownerJson }}</p>
      </div>
      <div class="bg-white/5 p-4 rounded-md">
        <p class="whitespace-pre-wrap text-xs">{{ worldJson }}</p>
        <p class="whitespace-pre-wrap text-xs">
          {{ instance.trackerState.locationJoinedAt }}
        </p>
      </div>
      <div class="bg-white/5 p-4 rounded-md">
        <p class="whitespace-pre-wrap text-xs">
          Users: {{ instance.currentInstancePlayers.value.length }}
        </p>
        <p class="whitespace-pre-wrap text-xs">{{ usersJson }}</p>
      </div>
      <div class="bg-white/5 p-4 rounded-md">
        <p class="whitespace-pre-wrap text-xs">{{ activitiesJson }}</p>
      </div>
    </div>
  </AppRoute>
</template>

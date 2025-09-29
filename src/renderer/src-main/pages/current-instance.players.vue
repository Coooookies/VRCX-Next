<script setup lang="ts">
import CurrentInstancePlayerTable from '../components/current-instance/current-instance-player-table.vue'
import CurrentInstancePlayerTableSkeleton from '../components/current-instance/current-instance-player-table-skeleton.vue'
import { computed, inject } from 'vue'
import { useCurrentInstance } from '../composables/current-instance'
import type { Ref } from 'vue'

const searchValue = inject<Ref<string>>('current-instance:search-value')!
const { instancePlayers, isInInstance } = useCurrentInstance()

const isInstancePreloading = computed(() => {
  return isInInstance && instancePlayers.value.length === 0
})
</script>

<template>
  <CurrentInstancePlayerTable
    v-if="!isInstancePreloading"
    :players="instancePlayers"
    :search-value="searchValue"
  />
  <CurrentInstancePlayerTableSkeleton v-else />
</template>

<script setup lang="ts">
import CurrentInstancePlayerTable from '../components/current-instance/current-instance-player-table.vue'
import { computed, inject } from 'vue'
import { useCurrentInstance } from '../composables/current-instance'
import type { Ref } from 'vue'

const { instancePlayers, isInstanceLoading } = useCurrentInstance()
const isInstancePreloading = computed(() => {
  return isInstanceLoading.value && instancePlayers.value.length === 0
})

const searchValue = inject<Ref<string>>('current-instance:search-value')!
</script>

<template>
  <CurrentInstancePlayerTable
    v-if="!isInstancePreloading"
    :players="instancePlayers"
    :search-value="searchValue"
  />
</template>

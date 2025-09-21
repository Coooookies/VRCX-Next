<script setup lang="ts">
import { computed } from 'vue'
import { useCurrentInstance } from '../composables/current-instance'
import CurrentInstancePlayerTable from '../components/current-instance/current-instance-player-table.vue'

const { instancePlayers, isInstanceLoading } = useCurrentInstance()
const isInstancePreloading = computed(() => {
  return isInstanceLoading.value && instancePlayers.value.length === 0
})
</script>

<template>
  <CurrentInstancePlayerTable v-if="!isInstancePreloading" :players="instancePlayers" />
</template>

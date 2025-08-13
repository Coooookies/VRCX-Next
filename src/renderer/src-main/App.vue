<script setup lang="ts">
import { useLocaleUpdater } from './composables/locale-updater'
import { ScaleRouterView } from './components/router-view'

useLocaleUpdater()
</script>

<template>
  <div class="relative w-full h-screen overflow-hidden">
    <ScaleRouterView />
  </div>
</template>

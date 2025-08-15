<script setup lang="ts">
import { useLocaleUpdater } from './composables/locale-updater'
import { Toaster } from '@renderer/shared/components/ui/sonner'
import Viewer from './pages/index.vue'

useLocaleUpdater()
</script>

<template>
  <Toaster />
  <Viewer />
</template>

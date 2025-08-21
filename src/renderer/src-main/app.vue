<script setup lang="ts">
import { useLocaleUpdater } from '@renderer/shared/components/locale/locale-updater'
import { useElapsedTimer } from '@renderer/shared/components/elapsed-timer/provider'
import { Toaster } from '@renderer/shared/components/ui/sonner'
import Viewer from './pages/index.vue'

useLocaleUpdater()
useElapsedTimer()
</script>

<template>
  <Toaster />
  <Viewer />
</template>

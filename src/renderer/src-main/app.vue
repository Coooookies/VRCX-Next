<script setup lang="ts">
import { useLocaleUpdater } from '@renderer/shared/components/locale/locale-updater'
import { useTimer } from '@renderer/shared/components/timer/provider'
import { Toaster } from '@renderer/shared/components/ui/sonner'
import Viewer from './pages/index.vue'

useLocaleUpdater()
useTimer()
</script>

<template>
  <Toaster />
  <Viewer />
</template>

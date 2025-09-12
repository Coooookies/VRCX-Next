<script setup lang="ts">
import AppRoute from '../layouts/app-route.vue'
import CurrentInstanceInfoTabs from '../components/current-instance/current-instance-info-tabs.vue'
</script>

<template>
  <AppRoute>
    <div class="mx-auto py-10 w-[1038px]">
      <CurrentInstanceInfoTabs />
    </div>
  </AppRoute>
</template>

<script setup lang="ts">
import CurrentInstanceEventHeader from '../components/current-instance/current-instance-event-header.vue'
import { useCurrentInstance } from '../composables/current-instance'

const { instance } = useCurrentInstance()
</script>

<template>
  <div class="">
    <CurrentInstanceEventHeader :joined-at="instance.currentInstance.locationJoinedAt" />
  </div>
</template>

<script setup lang="ts">
import ShinyText from '@renderer/shared/components/shiny-text.vue'

const props = defineProps<{
  shiny?: boolean
  text: string
}>()
</script>

<template>
  <div class="flex flex-row items-center text-xs text-muted-foreground overflow-hidden">
    <ShinyText v-if="props.shiny" class="truncate" :text="props.text" :speed="2" />
    <span v-else class="truncate">{{ props.text }}</span>
  </div>
</template>

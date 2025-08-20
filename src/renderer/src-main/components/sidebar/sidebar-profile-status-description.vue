<script setup lang="ts">
const props = defineProps<{
  description: string
}>()
</script>

<template>
  <div class="flex flex-row items-center text-xs text-muted-foreground">
    <span class="truncate">{{ props.description }}</span>
  </div>
</template>

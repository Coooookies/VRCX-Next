<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <div className="flex flex-col items-center gap-2 text-center">
    <h1 className="text-2xl font-bold">{{ props.title }}</h1>
  </div>
</template>

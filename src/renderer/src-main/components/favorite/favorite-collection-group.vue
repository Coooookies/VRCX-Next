<script setup lang="ts">
const props = defineProps<{
  description: string
}>()
</script>

<template>
  <div class="space-y-4">
    <div class="h-4 flex flex-row items-center gap-1.5">
      <span class="font-bold text-base">{{ props.description }}</span>
    </div>
    <div class="grid gap-3 grid-cols-3 @5xl:grid-cols-2 w-full">
      <slot />
    </div>
  </div>
</template>

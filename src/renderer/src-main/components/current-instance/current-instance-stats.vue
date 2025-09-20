<script setup lang="ts">
const props = defineProps<{
  label: string
  value?: string
}>()
</script>

<template>
  <div class="w-full h-10 flex flex-col gap-0.5 justify-center flex-1 text-left overflow-hidden">
    <p class="text-[13px] text-muted-foreground truncate">{{ props.label }}</p>
    <p class="text-sm text-foreground truncate">
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        {{ props.value }}
      </template>
    </p>
  </div>
</template>

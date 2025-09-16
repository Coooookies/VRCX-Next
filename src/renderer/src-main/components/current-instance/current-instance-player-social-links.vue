<script setup lang="ts">
import SocialLink from '@renderer/shared/components/social-link/social-link.vue'

const props = defineProps<{
  links: string[]
}>()
</script>

<template>
  <div class="flex flex-row gap-1">
    <SocialLink v-for="(link, index) in props.links" :key="index" :href="link" />
  </div>
</template>

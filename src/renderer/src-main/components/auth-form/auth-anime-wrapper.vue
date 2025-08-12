<script setup lang="ts">
import { motion } from 'motion-v'
import { ANIME_AUTH_FORM_COMPOSITION, ANIME_AUTH_TRANSITION_STYLE } from './animation'
</script>

<template>
  <motion.div
    initial="hidden"
    animate="enter"
    exit="exit"
    :variants="ANIME_AUTH_FORM_COMPOSITION"
    :style="ANIME_AUTH_TRANSITION_STYLE"
  >
    <slot />
  </motion.div>
</template>

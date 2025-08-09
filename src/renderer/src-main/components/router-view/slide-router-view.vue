<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  keepAliveKeys: {
    type: Array as PropType<string[]>,
    default: () => []
  }
})
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition :name="`router-transition-${route.meta.transition_type}`">
      <KeepAlive :include="props.keepAliveKeys">
        <component :is="Component" class="will-change-[transform,opacity]" />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<style scoped>
.router-transition-top-enter-active,
.router-transition-down-enter-active,
.router-transition-top-leave-active,
.router-transition-down-leave-active {
  position: absolute !important;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  transition-property: opacity transform;
  transition-duration: 150ms, 150ms;
  transition-timing-function: cubic-bezier(0.38, 0.05, 0.07, 1);
}

.router-transition-top-enter-active,
.router-transition-down-enter-active {
  transition-duration: 300ms, 300ms;
  transition-delay: 70ms, 70ms;
  transition-timing-function: cubic-bezier(0.1, 0.33, 0, 1.01);
}

.router-transition-top-enter-to,
.router-transition-down-enter-to,
.router-transition-top-leave-from,
.router-transition-down-leave-from {
  opacity: 1;
  transform: translateX(0px);
}

.router-transition-top-enter-from,
.router-transition-down-enter-from,
.router-transition-top-leave-to,
.router-transition-down-leave-to {
  opacity: 0;
}

.router-transition-top-enter-from,
.router-transition-down-leave-to {
  transform: translateX(30px);
}

.router-transition-top-leave-to,
.router-transition-down-enter-from {
  transform: translateX(-30px);
}
</style>

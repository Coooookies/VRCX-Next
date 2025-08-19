<script setup lang="ts">
// import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import ScrollContainer from '@renderer/shared/components/scroll-container.vue'
import SidebarFriendsHeader from './sidebar-friends-header.vue'
import { LaughIcon } from 'lucide-vue-next'
</script>

<template>
  <ScrollContainer>
    <SidebarFriendsHeader :icon="LaughIcon" label="在线 (8)" collapsed />
    <!-- <RecycleScroller v-slot="{ item }" key-field="id" page-mode :items="items" :item-size="32">
      <div class="user w-10 overflow-hidden">
        {{ item.name }}
      </div>
    </RecycleScroller> -->
  </ScrollContainer>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import ScrollContainer from '@renderer/shared/components/scroll-container.vue'
import SidebarFriendsHeader from './sidebar-friends-header.vue'
import SidebarFriendsOverview from './sidebar-friends-overview.vue'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import type { VirtualFriend } from '@renderer/src-main/composables/sidebar-friends'
import SidebarProfileOverviewSkeleton from './sidebar-profile-overview-skeleton.vue'

const props = defineProps<{
  friends: VirtualFriend[]
  isLoading?: boolean
}>()

const emits = defineEmits<{
  (e: 'toggleCollapse', groupId: string): void
}>()
</script>

<template>
  <div class="relative">
    <div
      v-if="props.isLoading && props.friends.length === 0"
      class="w-full h-full overflow-hidden pt-1"
    >
      <SidebarProfileOverviewSkeleton v-for="(_, i) in Array.from({ length: 20 })" :key="i" />
    </div>
    <ScrollContainer v-else class="w-full h-full" fade-out-at-top fade-out-at-bottom>
      <DynamicScroller key-field="id" page-mode :items="props.friends" :min-item-size="40">
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :size-dependencies="['item.type']"
            :active="active"
            :data-index="index"
            class="w-full h-fit"
          >
            <SidebarFriendsHeader
              v-if="item.type === 'header'"
              :icon="item.icon"
              :label="item.label"
              :collapsed="item.collapsed"
              @click="emits('toggleCollapse', item.id)"
            />
            <SidebarFriendsOverview
              v-else
              :user="item.item"
              :show-elapsed-timer="item.mode === 'timer'"
            />
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </ScrollContainer>
  </div>
</template>

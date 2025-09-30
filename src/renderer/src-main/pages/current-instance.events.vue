<script setup lang="ts">
import { computed, inject } from 'vue'
import CurrentInstanceEventHeader from '../components/current-instance/current-instance-event-header.vue'
import CurrentInstanceEventItemUserJoin from '../components/current-instance/current-instance-event-item-user-join.vue'
import CurrentInstanceEventItemUserLeave from '../components/current-instance/current-instance-event-item-user-leave.vue'
import CurrentInstanceEventItemUserPresent from '../components/current-instance/current-instance-event-item-user-present.vue'
import { useCurrentInstance } from '../composables/current-instance'
import { InstanceEvents } from '@shared/definition/vrchat-instances'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import type { Ref } from 'vue'
import type { InstancePresentUser } from '../components/current-instance/types'

const searchValue = inject<Ref<string>>('current-instance:search-value')!
const { instance, instanceEvents } = useCurrentInstance()

const instanceSortedEvents = computed(() => {
  const availableEvents = [InstanceEvents.UserJoin, InstanceEvents.UserLeave] as readonly string[]
  return instanceEvents.value
    .filter((item) => availableEvents.includes(item.type))
    .filter((item) => {
      const searchCtx = searchValue.value.toLowerCase()

      if (!searchValue.value) {
        return true
      }

      switch (item.type) {
        case InstanceEvents.UserJoin:
        case InstanceEvents.UserLeave:
        case InstanceEvents.UserPresent:
          return item.content.userName.toLowerCase().includes(searchCtx)
        default:
          return false
      }
    })
    .toSorted((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime())
})

const instancePresentUsers = computed(() => {
  return instanceEvents.value.reduce<InstancePresentUser[]>((acc, event) => {
    if (event.type === InstanceEvents.UserPresent) {
      acc.push({
        userId: event.content.userId,
        userName: event.content.userName,
        profileIconFileId: event.content.user?.profileIconFileId,
        profileIconFileVersion: event.content.user?.profileIconFileVersion
      })
    }
    return acc
  }, [])
})

const instancePresentUsersVisible = computed(() => {
  if (!searchValue.value && instancePresentUsers.value.length > 0) {
    return true
  }

  return instancePresentUsers.value.some((user) =>
    user.userName.toLowerCase().includes(searchValue.value.toLowerCase())
  )
})

const isLastItem = (index: number) => {
  return index === instanceSortedEvents.value.length - 1 && !instancePresentUsersVisible.value
}
</script>

<template>
  <div class="w-full">
    <CurrentInstanceEventHeader class="sticky top-32 z-1" :joined-at="instance.locationJoinedAt" />
    <div class="w-full pt-1.5">
      <DynamicScroller
        key-field="eventId"
        page-mode
        item-class="group/event-item"
        :items="instanceSortedEvents"
        :min-item-size="70"
      >
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :size-dependencies="['item.type']"
            :active="active"
            :data-index="index"
            class="w-full h-fit"
          >
            <CurrentInstanceEventItemUserJoin
              v-if="item.type === InstanceEvents.UserJoin"
              :icon-file-id="item.content.user?.profileIconFileId"
              :icon-file-version="item.content.user?.profileIconFileVersion"
              :user-name="item.content.userName"
              :recorded-at="item.recordedAt"
              :last-item="isLastItem(index)"
            />
            <CurrentInstanceEventItemUserLeave
              v-else-if="item.type === InstanceEvents.UserLeave"
              :icon-file-id="item.content.user?.profileIconFileId"
              :icon-file-version="item.content.user?.profileIconFileVersion"
              :user-name="item.content.userName"
              :recorded-at="item.recordedAt"
              :last-item="isLastItem(index)"
            />
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
      <CurrentInstanceEventItemUserPresent
        v-if="instancePresentUsersVisible"
        :users="instancePresentUsers"
      />
    </div>
  </div>
</template>

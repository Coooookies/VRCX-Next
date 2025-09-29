<script setup lang="ts">
import { computed, inject } from 'vue'
import CurrentInstanceEventHeader from '../components/current-instance/current-instance-event-header.vue'
import CurrentInstanceEventItemUserJoin from '../components/current-instance/current-instance-event-item-user-join.vue'
import CurrentInstanceEventItemUserLeave from '../components/current-instance/current-instance-event-item-user-leave.vue'
import CurrentInstanceEventItemUserPresent from '../components/current-instance/current-instance-event-item-user-present.vue'
import { useCurrentInstance } from '../composables/current-instance'
import { InstanceEvents } from '@shared/definition/vrchat-instances'
import type { Ref } from 'vue'
import type { InstancePresentUser } from '../components/current-instance/types'

const searchValue = inject<Ref<string>>('current-instance:search-value')!
const { instance, instanceEvents } = useCurrentInstance()

const instanceSortedEvents = computed(() => {
  return instanceEvents.value
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
</script>

<template>
  <div class="w-full">
    <CurrentInstanceEventHeader class="sticky top-31 z-1" :joined-at="instance.locationJoinedAt" />
    <div class="w-full pt-1.5">
      <template v-for="(event, index) in instanceSortedEvents" :key="index">
        <CurrentInstanceEventItemUserJoin
          v-if="event.type === InstanceEvents.UserJoin"
          :icon-file-id="event.content.user?.profileIconFileId"
          :icon-file-version="event.content.user?.profileIconFileVersion"
          :user-name="event.content.userName"
          :recorded-at="event.recordedAt"
        />
        <CurrentInstanceEventItemUserLeave
          v-else-if="event.type === InstanceEvents.UserLeave"
          :icon-file-id="event.content.user?.profileIconFileId"
          :icon-file-version="event.content.user?.profileIconFileVersion"
          :user-name="event.content.userName"
          :recorded-at="event.recordedAt"
        />
      </template>
      <CurrentInstanceEventItemUserPresent
        v-if="instancePresentUsersVisible"
        :users="instancePresentUsers"
      />
    </div>
  </div>
</template>

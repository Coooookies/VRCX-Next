<script setup lang="ts">
import CurrentInstanceEventUserButton from './current-instance-event-user-button.vue'
import InstanceLoactionIcon from '@shared/assets/vector/instance-location.svg?component'
import { cn } from '@renderer/shared/utils/style'
import type { InstancePresentUser } from './types'

const props = defineProps<{
  users: InstancePresentUser[]
}>()
</script>

<template>
  <div
    :class="
      cn(
        'py-3 px-2.5 relative',
        'after:absolute after:content-normal after:left-5.5 after:top-0 after:h-full',
        'after:border-l-2 after:border-muted after:border-dotted after:-z-1',
        'last:after:h-6'
      )
    "
  >
    <div class="relative h-6.5 flex flex-row items-center gap-2">
      <div class="size-6.5 bg-primary rounded-full flex items-center justify-center">
        <InstanceLoactionIcon class="size-4 text-foreground" />
      </div>
      <span class="text-[13px] text-muted-foreground">These players got here before you!</span>
    </div>
    <div class="w-full rounded-lg border overflow-hidden mt-2.5">
      <div class="p-2 flex flex-row gap-2 flex-wrap">
        <CurrentInstanceEventUserButton
          v-for="user in props.users"
          :key="user.userId"
          :icon-file-version="user.profileIconFileVersion"
          :icon-file-id="user.profileIconFileId"
          :user-name="user.userName"
        />
      </div>
      <div class="bg-muted/30 h-7 px-3 flex flex-row items-center">
        <span class="text-xs text-muted-foreground">{{ props.users.length }} Players</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BadgeVRChatPlus from '../badge/badge-vrchat-plus.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/shared/components/ui/dropdown-menu'
import { Button } from '@renderer/shared/components/ui/button'
import { ChevronDownIcon } from 'lucide-vue-next'

const props = defineProps<{
  declineWithMessageTitle: string
  declineWithPhotoTitle: string
  isSupporter: boolean
}>()

const emits = defineEmits<{
  (e: 'respondInviteWithMessage'): void
  (e: 'respondInviteWithPhoto'): void
}>()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button class="size-6 p-0 rounded-l-none rounded-r-sm" size="icon" variant="secondary">
        <ChevronDownIcon class="size-3.5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-fit">
      <DropdownMenuItem
        class="h-7 pr-1.5 justify-between"
        @click="emits('respondInviteWithMessage')"
      >
        <span class="text-xs">{{ props.declineWithMessageTitle }}</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        class="h-7 pr-1.5 justify-between"
        :disabled="!props.isSupporter"
        @click="emits('respondInviteWithPhoto')"
      >
        <span class="text-xs">{{ props.declineWithPhotoTitle }}</span>
        <BadgeVRChatPlus class="!w-10 ml-2" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

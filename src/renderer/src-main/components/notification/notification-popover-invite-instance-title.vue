<script setup lang="ts">
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@renderer/shared/components/ui/hover-card'
import { Button } from '@renderer/shared/components/ui/button'
import { XIcon } from 'lucide-vue-next'

const props = defineProps<{
  senderName?: string | null
  worldName: string
  description: string
}>()

const emits = defineEmits<{
  (e: 'hideNotification'): void
  (e: 'showSender'): void
  (e: 'showInstance'): void
}>()
</script>

<template>
  <div class="w-full flex flex-row items-center gap-1 overflow-hidden">
    <p class="flex-1 text-sm truncate">
      <Button
        v-if="props.senderName"
        as="a"
        class="bg-transparent dark:bg-transparent p-0 inline font-semibold hover:underline mr-1"
        @click="emits('showSender')"
      >
        {{ props.senderName }}
      </Button>
      <HoverCard :open-delay="0" :close-delay="0">
        <HoverCardTrigger as-child>
          <Button
            as="a"
            class="bg-transparent dark:bg-transparent p-0 inline group/world-name"
            @click="emits('showInstance')"
          >
            <span class="font-medium text-muted-foreground mr-1">{{ props.description }}</span>
            <span class="font-semibold group-hover/world-name:underline">
              {{ props.worldName }}
            </span>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent class="w-auto px-2 py-1.5 text-xs" side="top" :align="'start'">
          {{ props.worldName }}
        </HoverCardContent>
      </HoverCard>
    </p>
    <Button
      size="icon"
      variant="ghost"
      class="size-4 rounded-[4px] hidden group-hover/notification-card:flex"
      @click.stop="emits('hideNotification')"
    >
      <XIcon class="size-3.5" />
    </Button>
  </div>
</template>

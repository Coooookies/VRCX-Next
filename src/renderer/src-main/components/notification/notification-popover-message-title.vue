<script setup lang="ts">
import { Button } from '@renderer/shared/components/ui/button'
import { XIcon } from 'lucide-vue-next'

const props = defineProps<{
  senderName?: string | null
  description: string
}>()

const emits = defineEmits<{
  (e: 'hideNotification'): void
  (e: 'showSender'): void
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
      <span class="font-medium text-muted-foreground">{{ props.description }}</span>
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

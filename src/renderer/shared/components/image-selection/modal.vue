<script setup lang="ts">
import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '../ui/dialog'
import { Button } from '../ui/button'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  confirmLabel: {
    type: String,
    default: '确认'
  },
  cancelLabel: {
    type: String,
    default: '取消'
  },
  dismissible: {
    type: Boolean,
    default: true
  }
})

const emitter = defineEmits<{
  (e: 'close', result: boolean | undefined): void
}>()

const onCloseRouteModal = (e?: Event) => {
  e && e.preventDefault()
}

const onCancelCloseRouteModal = (e?: Event) => {
  e && e.preventDefault()
  props.dismissible && emitter('close', undefined)
}

defineExpose({
  close: () => emitter('close', true)
})
</script>

<template>
  <Dialog>
    <DialogContent
      class="!max-w-full w-[440px] rounded-lg"
      :close-button="false"
      @focus-outside="onCancelCloseRouteModal"
      @interact-outside="onCancelCloseRouteModal"
      @pointer-down-outside="onCancelCloseRouteModal"
      @escape-key-down="onCancelCloseRouteModal"
      @close-auto-focus="onCloseRouteModal"
    >
      <DialogHeader>
        <DialogTitle>{{ props.title }}</DialogTitle>
        <DialogDescription>{{ props.description }}</DialogDescription>
      </DialogHeader>
      <div class="pb-1">
        <!-- <Progress class="h-1.5" :model-value="props.progress" /> -->
      </div>
      <DialogFooter v-if="props.dismissible">
        <Button variant="outline" @click="onCancelCloseRouteModal">
          {{ props.cancelLabel }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

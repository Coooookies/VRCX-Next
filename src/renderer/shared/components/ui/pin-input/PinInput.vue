<script setup lang="ts">
import type { PinInputRootEmits, PinInputRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { PinInputFocusPayload, PinInputType } from './types'
import { provide, useId } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { PinInputRoot, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@renderer/shared/utils/style'

const props = withDefaults(
  defineProps<
    Omit<PinInputRootProps, 'type'> & { class?: HTMLAttributes['class']; type?: PinInputType }
  >(),
  {
    modelValue: () => []
  }
)

const emits = defineEmits<PinInputRootEmits>()

const pinInputUniqueId = useId()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const focusPayload = new Map<number, PinInputFocusPayload['focus']>()

function registerChildFocusPayload(payload: PinInputFocusPayload) {
  focusPayload.set(payload.index, payload.focus)
}

function unregisterChildFocusPayload(index: number) {
  focusPayload.delete(index)
}

function focusChild(index: number = 0) {
  const focus = focusPayload.get(index)
  if (focus) {
    focus()
  }
}

provide('registerChildFocusPayload', registerChildFocusPayload)
provide('unregisterChildFocusPayload', unregisterChildFocusPayload)
provide('pinInputUniqueId', pinInputUniqueId)

defineExpose({
  focus: focusChild
})
</script>

<template>
  <PinInputRoot
    data-slot="pin-input"
    v-bind="forwarded"
    :class="
      cn('flex items-center gap-2 has-disabled:opacity-50 disabled:cursor-not-allowed', props.class)
    "
  >
    <slot />
  </PinInputRoot>
</template>

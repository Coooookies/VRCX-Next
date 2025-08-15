<script setup lang="ts">
import { ProxyState } from '@shared/definition/setting'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'

export interface StateItem {
  label: string
  value: ProxyState
}

const props = defineProps<{
  items: StateItem[]
  modelValue: ProxyState
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: ProxyState): void
}>()
</script>

<template>
  <RadioGroup
    :model-value="props.modelValue"
    @update:model-value="emits('update:modelValue', $event as ProxyState)"
  >
    <div v-for="item in items" :key="item.value" class="flex items-center gap-3">
      <RadioGroupItem :id="`proxy-type-${item.value}`" :value="item.value" />
      <Label :for="`proxy-type-${item.value}`">{{ item.label }}</Label>
    </div>
  </RadioGroup>
</template>

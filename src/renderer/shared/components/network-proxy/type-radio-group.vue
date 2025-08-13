<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'
import { ProxyType } from '@shared/types/setting'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'

export interface TypeItem {
  label: string
  value: ProxyType
}

const props = defineProps<{
  items: TypeItem[]
  modelValue: ProxyType
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: ProxyType): void
}>()
</script>

<template>
  <RadioGroup
    class="flex flex-wrap gap-3"
    :model-value="props.modelValue"
    @update:model-value="emits('update:modelValue', $event as ProxyType)"
  >
    <div
      v-for="item in items"
      :key="item.value"
      :class="
        cn(
          'border-input has-data-[state=checked]:border-primary/50 relative flex flex-row items-center gap-4',
          'rounded-md border h-10 pl-3 shadow-xs outline-none flex-1'
        )
      "
    >
      <div class="flex items-center gap-2.5">
        <RadioGroupItem
          :id="`proxy-type-${item.value}`"
          :value="item.value"
          class="after:absolute after:inset-0"
        />
        <Label :for="`proxy-type-${item.value}`">{{ item.label }}</Label>
      </div>
    </div>
  </RadioGroup>
</template>

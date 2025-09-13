<script setup lang="ts">
import { TabsList, TabsTrigger } from '@renderer/shared/components/ui/tabs'

const props = defineProps<{
  tabs: CurrentInstanceInfoTab[]
}>()

export interface CurrentInstanceInfoTab {
  value: string
  label: string
}
</script>

<template>
  <TabsList class="h-9 bg-transparent p-1 inset-ring inset-ring-border rounded-[11px]">
    <TabsTrigger
      v-for="tab in props.tabs"
      :key="tab.value"
      :value="tab.value"
      class="h-7 flex-1 rounded-[7px] data-[state=active]:bg-muted data-[state=active]:shadow-none"
    >
      {{ tab.label }}
    </TabsTrigger>
  </TabsList>
</template>

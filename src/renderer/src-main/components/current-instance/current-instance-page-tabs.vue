<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from '@renderer/shared/components/ui/tabs'
import { cn } from '@renderer/shared/utils/style'

const value = defineModel<string>('modelValue', {
  default: ''
})

const props = defineProps<{
  tabs: CurrentInstancePageTab[]
}>()

export interface CurrentInstancePageTab {
  value: string
  label: string
}
</script>

<template>
  <Tabs v-model="value" class="w-fit h-9 items-center">
    <TabsList class="h-auto rounded-none bg-transparent p-0">
      <TabsTrigger
        v-for="tab in props.tabs"
        :key="tab.value"
        :value="tab.value"
        :class="
          cn(
            'h-full gap-1.5 relative rounded-none px-2.5 py-2 after:absolute data-[state=active]:bg-transparent data-[state=active]:shadow-none',
            'after:bg-primary after:w-4.5 after:bottom-0 after:h-[3px] after:rounded-md',
            'after:scale-x-50 data-[state=active]:after:scale-x-100 after:opacity-0 data-[state=active]:after:opacity-100',
            'after:transition-[scale,opacity] after:duration-150 after:ease-in-out'
          )
        "
      >
        {{ tab.label }}
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>

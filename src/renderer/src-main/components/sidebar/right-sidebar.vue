<script setup lang="ts">
import ExpandRightIcon from '@shared/assets/vector/navigator-icon-expand-right.svg?component'
import CollapseRightIcon from '@shared/assets/vector/navigator-icon-collapse-right.svg?component'
import SidebarContainer from './sidebar-container.vue'
import SidebarIconButton from './sidebar-icon-button.vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import { cn } from '@renderer/shared/utils/style'
import { ref } from 'vue'
import type { SidebarContainerProps, SidebarStateEmits, SidebarStateProps } from './types'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import ScrollContainer from '@renderer/shared/components/scroll-container.vue'
const expanded = defineModel<boolean>('expanded')
const props = defineProps<SidebarContainerProps & SidebarStateProps>()
const emits = defineEmits<SidebarStateEmits>()

// const items = [
//   {
//     id: 1,
//     label: 'Title',
//     size: 64
//   },
//   {
//     id: 2,
//     label: 'Foo',
//     size: 32
//   },
//   {
//     id: 3,
//     label: 'Bar',
//     size: 32
//   }
// ]

const items = ref(
  Array.from({ length: 135 }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`
  }))
)

console.log(emits)
</script>

<template>
  <SidebarContainer
    v-bind="props"
    v-model:expanded="expanded"
    :class="
      cn(
        'right-0 border-l border-transparent',
        expanded
          ? 'border-sidebar-border/40 bg-background'
          : 'hover:border-sidebar-border/40 hover:bg-background/80 group/sidebar-right'
      )
    "
  >
    <div
      :class="
        cn(
          'absolute top-0 left-0 w-full h-full backdrop-blur-2xl',
          'transition-opacity duration-200 ease-[cubic-bezier(.16,1,.3,1)]',
          'opacity-0 group-hover/sidebar-right:opacity-100'
        )
      "
    />
    <div class="absolute top-0 left-0 w-full h-full flex flex-col">
      <div :class="cn('w-full h-10', expanded ? 'electron-drag' : 'electron-no-drag')" />
      <div class="flex-1 overflow-hidden">
        <ScrollContainer class="w-full h-full">
          <RecycleScroller
            v-slot="{ item }"
            key-field="id"
            page-mode
            :items="items"
            :item-size="32"
          >
            <div class="user w-10 overflow-hidden">
              {{ item.name }}
            </div>
          </RecycleScroller>
        </ScrollContainer>
      </div>
      <div
        :class="
          cn(
            'py-2.5 border-t border-transparent transition-colors duration-200 ease-in-out',
            'group-hover/sidebar-collapsed:border-sidebar-border/40 group-has-[*]/sidebar-expanded:border-sidebar-border/40'
          )
        "
      >
        <SidebarIconButton
          :icon="expanded ? CollapseRightIcon : ExpandRightIcon"
          :label="expanded ? 'Collapse' : 'Expand'"
          @click="expanded = !expanded"
        />
      </div>
    </div>
  </SidebarContainer>
</template>

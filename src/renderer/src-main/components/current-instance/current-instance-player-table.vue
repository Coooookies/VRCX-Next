<script setup lang="ts">
import InstanceFriendAvatarMask from '@shared/assets/vector/instance-friend-avatar-mask.svg?url'
import InstanceOwnerAvatarMask from '@shared/assets/vector/instance-owner-avatar-mask.svg?url'
import { computed, ref } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import { baseSortingState, columns } from './player-data-table'
import { valueUpdater } from '@renderer/shared/components/ui/table/utils'
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable
} from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/shared/components/ui/table'
import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/vue-table'
import type { InstancePlayer } from '@renderer/src-main/composables/current-instance'
import type { TableColumnMeta } from './types'

const friendAvatarMask = `url("${InstanceFriendAvatarMask}")`
const ownerAvatarMask = `url("${InstanceOwnerAvatarMask}")`

const props = defineProps<{
  players: InstancePlayer[]
}>()

const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({
  isFriend: false,
  isOwner: false
})

const rowSorting = ref<SortingState>([
  {
    id: 'joinedAt',
    desc: true
  }
])

const rowComputedSorting = computed(() => {
  return [...baseSortingState, ...rowSorting.value]
})

const table = useVueTable({
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
  columns,
  state: {
    get sorting() {
      return rowComputedSorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    }
  },
  get data() {
    return computed(() => props.players ?? [])
  }
})

const metaWrapper = (meta: unknown) => {
  return meta as TableColumnMeta
}
</script>

<template>
  <Table
    class="table-fixed w-full"
    container-class="w-full h-fit"
    :style="{
      '--mask-instance-friend-avatar': friendAvatarMask,
      '--mask-instance-owner-avatar': ownerAvatarMask
    }"
  >
    <TableHeader class="sticky top-34 z-1">
      <TableRow
        v-for="headerGroup in table.getHeaderGroups()"
        :key="headerGroup.id"
        class="h-10 !border-0 bg-background hover:bg-background"
      >
        <TableHead
          v-for="header in headerGroup.headers"
          :key="header.id"
          :class="
            cn(
              'px-0 bg-muted/50',
              'first:rounded-l-md first:pl-1.5 last:rounded-r-md last:pr-1.5',
              metaWrapper(header.column.columnDef.meta)?.class?.th
            )
          "
        >
          <FlexRender
            v-if="!header.isPlaceholder"
            :render="header.column.columnDef.header"
            :props="header.getContext()"
          />
        </TableHead>
      </TableRow>
      <TableRow class="h-1.5 !border-0" />
    </TableHeader>
    <TableBody>
      <template v-if="table.getRowModel().rows?.length">
        <template v-for="row in table.getRowModel().rows" :key="row.id">
          <TableRow
            :data-state="row.getIsSelected() && 'selected'"
            class="h-12 border-0 hover:bg-transparent group/player-row"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :class="
                cn(
                  'px-0 group-hover/player-row:bg-muted/50',
                  'first:rounded-l-md first:pl-1.5 last:rounded-r-md last:pr-1.5',
                  metaWrapper(cell.column.columnDef.meta)?.class?.td
                )
              "
            >
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
      </template>
      <TableRow v-else>
        <TableCell :colspan="columns.length" class="h-24 text-center">No results.</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

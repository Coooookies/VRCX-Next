import ImageVRChatContext from '@renderer/shared/components/image-vrchat-context.vue'
import CurrentInstancePlayerActions from './current-instance-player-actions.vue'
import CurrentInstancePlayerLanguages from './current-instance-player-languages.vue'
import { h } from 'vue'
import { ChevronDownIcon, ChevronUpIcon, CircleUserRoundIcon } from 'lucide-vue-next'
import { Button } from '@renderer/shared/components/ui/button'
import { Skeleton } from '@renderer/shared/components/ui/skeleton'
import { ImageRoot, ImageFallback } from '@renderer/shared/components/ui/image'
import { RelativeTimerText } from '@renderer/shared/components/timer'
import type { InstanceUserSummary } from '@shared/definition/vrchat-instances'
import type { Column, ColumnDef } from '@tanstack/vue-table'
import { cn } from '@renderer/shared/utils/style'

function createSortHeader(column: Column<InstanceUserSummary>, label: string) {
  const isSorted = column.getIsSorted()

  return h(
    Button,
    {
      class: cn('!pl-2 rounded-sm h-7 gap-1 duration-0', isSorted ? '!pr-1.5' : '!pr-2'),
      variant: 'ghost',
      size: 'sm',
      onClick: () => {
        column.toggleSorting(column.getIsSorted() === 'asc')
      }
    },
    () => [
      h('span', { class: 'text-xs' }, label),
      isSorted
        ? h(isSorted === 'asc' ? ChevronUpIcon : ChevronDownIcon, { class: '!size-3.5' })
        : undefined
    ]
  )
}

export const columns: ColumnDef<InstanceUserSummary>[] = [
  {
    id: 'profileIcon',
    meta: {
      class: {
        th: 'w-12'
      }
    },
    cell: ({ row }) =>
      h('div', { class: 'flex items-center justify-center' }, [
        h(ImageRoot, { class: 'block size-6 rounded-full overflow-hidden' }, () => [
          row.original.user?.profileIconFileId && row.original.user?.profileIconFileVersion
            ? h(ImageVRChatContext, {
                class: 'size-full object-cover',
                fileId: row.original.user.profileIconFileId,
                version: row.original.user.profileIconFileVersion
              })
            : null,
          h(
            ImageFallback,
            { class: 'size-full bg-muted/50 flex items-center justify-center' },
            {
              default: () => h(CircleUserRoundIcon, { class: 'size-4 text-muted-foreground' }),
              loading: () => h(Skeleton, { class: 'size-full' })
            }
          )
        ])
      ])
  },
  {
    accessorKey: 'userName',
    header: ({ column }) => createSortHeader(column, 'Player Name'),
    cell: ({ row }) =>
      h('div', { class: 'px-2 flex flex-row items-center' }, [
        h('span', { class: 'text-[13px]' }, row.original.userName)
        // h('span', { class: 'text-xs' }, 'Email')
      ])
  },
  {
    id: 'locale',
    meta: {
      class: {
        th: 'w-30'
      }
    },
    header: () =>
      h(
        'div',
        {
          class: 'px-2'
        },
        h('span', { class: 'text-xs' }, 'Locale')
      ),
    cell: ({ row }) =>
      h('div', { class: 'px-2' }, [
        h(CurrentInstancePlayerLanguages, {
          languages: row.original.user?.languages || []
        })
      ])
  },
  {
    accessorKey: 'joinedAt',
    meta: {
      class: {
        th: 'w-30'
      }
    },
    header: ({ column }) => createSortHeader(column, 'Joined At'),
    cell: ({ row }) =>
      h('div', { class: 'px-2 flex flex-row items-center' }, [
        h(RelativeTimerText, {
          class: 'text-xs text-muted-foreground',
          startTime: row.original.joinedAt
        })
      ])
  },
  {
    id: 'actions',
    meta: {
      class: {
        th: 'w-12'
      }
    },
    cell: () => {
      return h(
        'div',
        { class: 'relative flex items-center justify-center' },
        h(CurrentInstancePlayerActions)
      )
    }
  }
]

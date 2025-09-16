import PhoneIcon from '@shared/assets/vector/profile-icon-phone.svg?component'
import ProfileNameParagraph from '@renderer/shared/components/paragraph/profile-name-paragraph.vue'
import CurrentInstancePlayerActions from './current-instance-player-actions.vue'
import CurrentInstancePlayerAvatar from './current-instance-player-avatar.vue'
import CurrentInstancePlayerLanguages from './current-instance-player-languages.vue'
import CurrentInstancePlayerSocialLinks from './current-instance-player-social-links.vue'
import { h } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-vue-next'
import { Button } from '@renderer/shared/components/ui/button'
import { RelativeTimerText } from '@renderer/shared/components/timer'
import { UserTrustRank } from '@shared/definition/vrchat-users'
import type { Column, ColumnDef, SortingState } from '@tanstack/vue-table'
import type { InstancePlayer } from '@renderer/src-main/composables/current-instance'
import { Platform } from '@shared/definition/vrchat-api-response-replenish'

function createSortHeader(column: Column<InstancePlayer>, label: string) {
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

export const columns: ColumnDef<InstancePlayer>[] = [
  {
    id: 'profileIcon',
    meta: {
      class: {
        th: 'w-12'
      }
    },
    cell: ({ row }) =>
      h('div', { class: 'flex items-center justify-center' }, [
        h(CurrentInstancePlayerAvatar, {
          fileId: row.original.user?.profileIconFileId,
          version: row.original.user?.profileIconFileVersion,
          isFriend: row.original.isFriend,
          isOwner: row.original.isOwner
        })
      ])
  },
  {
    accessorKey: 'isOwner'
  },
  {
    accessorKey: 'isFriend'
  },
  {
    accessorKey: 'userName',
    meta: {
      class: {
        th: 'w-full'
      }
    },
    header: ({ column }) => createSortHeader(column, 'Player Name'),
    cell: ({ row }) => {
      const isPhone =
        row.original.user?.platform === Platform.Android ||
        row.original.user?.platform === Platform.IOS

      return h('div', { class: 'px-2 flex flex-row items-center gap-1.5 overflow-hidden' }, [
        h(ProfileNameParagraph, {
          class: 'text-[13px] font-semibold truncate',
          userName: row.original.userName,
          trustRank: row.original.user?.trustRank || UserTrustRank.Visitor,
          as: 'span'
        }),
        isPhone && h(PhoneIcon, { class: 'text-muted-foreground/50 size-3 shrink-0' })
      ])
    }
  },
  {
    id: 'links',
    meta: {
      class: {
        th: 'w-30'
      }
    },
    header: () =>
      h(
        'div',
        {
          class: 'px-2 flex flex-row items-center'
        },
        h('span', { class: 'text-xs' }, 'Links')
      ),
    cell: ({ row }) =>
      h('div', { class: 'px-2' }, [
        h(CurrentInstancePlayerSocialLinks, {
          links: row.original.user?.bioLinks || []
        })
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
          class: 'px-2 flex flex-row items-center'
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

export const baseSortingState: SortingState = [
  {
    id: 'isOwner',
    desc: true
  },
  {
    id: 'isFriend',
    desc: true
  }
]

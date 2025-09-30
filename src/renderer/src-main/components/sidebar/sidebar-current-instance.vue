<script setup lang="ts">
import ImageVRChatContext from '@renderer/shared/components/image-vrchat-context.vue'
import VRChatIcon from '@shared/assets/vector/navigator-icon-vrchat.svg?component'

import { cn } from '@renderer/shared/utils/style'
import { computed } from 'vue'
import { useI18n } from '@renderer/shared/locale'
import { useCurrentInstance } from '@renderer/src-main/composables/current-instance'
import { Button } from '@renderer/shared/components/ui/button'
import { Skeleton } from '@renderer/shared/components/ui/skeleton'
import { ImageFallback, ImageRoot } from '@renderer/shared/components/ui/image'
import { ImageIcon } from 'lucide-vue-next'

const { t } = useI18n()
const { isGameRunning, isInitializing, isInInstance, instance } = useCurrentInstance()

const props = defineProps<{
  active?: boolean
}>()

const currentWorld = computed(() => instance.worldDetail)
const isWaitingForJoin = computed(() => !isInInstance.value && isGameRunning.value)
</script>

<template>
  <div class="w-full h-10 px-3">
    <Button
      variant="link"
      :class="
        cn(
          'relative size-full pr-0 pl-2 overflow-hidden justify-start gap-0',
          'group/sidebar-button'
        )
      "
    >
      <div class="relative size-8 shrink-0">
        <div
          :class="
            cn(
              'relative size-full rounded-full p-1 before:transition-colors before:duration-150',
              'before:inset-0 before:absolute before:rounded-full before:border-2',
              'after:inset-0 after:absolute after:rounded-full after:border-2 after:border-transparent',
              isGameRunning
                ? active
                  ? 'before:border-muted-foreground/50'
                  : 'before:border-muted-foreground/15'
                : 'before:border-transparent',
              isWaitingForJoin && 'after:border-white after:mask-size-[200%_100%]',
              isWaitingForJoin && 'after:mask-x-from-50% after:mask-x-to-75%',
              isWaitingForJoin && 'after:animate-[animation-mask-shimmer_1.5s_infinite_linear]'
            )
          "
        >
          <div v-if="isGameRunning" class="bg-popover size-full rounded-full overflow-hidden">
            <ImageRoot v-if="isInInstance && currentWorld" class="size-full">
              <ImageVRChatContext
                :file-id="currentWorld.imageFileId"
                :version="currentWorld.imageFileVersion"
                :size="32"
                class="size-full object-cover"
              />
              <ImageFallback class="size-full flex items-center justify-center">
                <template #default>
                  <ImageIcon class="size-4 text-muted-foreground" />
                </template>
                <template #loading>
                  <Skeleton class="size-full" />
                </template>
              </ImageFallback>
            </ImageRoot>
            <Skeleton v-else class="size-full" />
          </div>
          <div v-else class="size-full flex items-center justify-center">
            <div class="size-6">
              <VRChatIcon
                :class="
                  cn(
                    'size-full transition-colors duration-200 ease-in-out',
                    'text-sidebar-foreground/55 group-hover/sidebar-button:text-sidebar-foreground/70',
                    'dark:text-sidebar-foreground/40 group-hover/sidebar-button:dark:text-sidebar-foreground/65',
                    props.active && '!text-sidebar-foreground/85 dark:!text-sidebar-foreground/90'
                  )
                "
              />
            </div>
          </div>
        </div>
      </div>
      <div
        :class="
          cn(
            'relative h-full flex items-center box-border transition-[opacity,translate] duration-300 ease-[cubic-bezier(.16,1,.3,1)]',
            'group-has-[*]/sidebar-expanded:translate-x-0 group-has-[*]/sidebar-expanded:opacity-100',
            'group-hover/sidebar-collapsed:translate-x-0 group-hover/sidebar-collapsed:opacity-100 -translate-x-1 opacity-0'
          )
        "
      >
        <span
          :class="
            cn(
              'absolute font-medium whitespace-nowrap text-left w-50 pl-3 pr-2.5 truncate',
              'text-sidebar-foreground/55 group-hover/sidebar-button:text-sidebar-foreground/70',
              'dark:text-sidebar-foreground/45 group-hover/sidebar-button:dark:text-sidebar-foreground/65',
              'transition-[color,font-weight] duration-200 ease-in-out',
              props.active &&
                'font-bold !text-sidebar-foreground/85 dark:!text-sidebar-foreground/90'
            )
          "
        >
          {{
            isGameRunning
              ? isInInstance
                ? !isInitializing
                  ? currentWorld?.worldName || '-'
                  : t('sidebar.vrchat_world_loading')
                : t('sidebar.vrchat_waiting_for_join')
              : t('sidebar.vrchat_not_running')
          }}
        </span>
      </div>
    </Button>
  </div>
</template>

<style>
@keyframes animation-mask-shimmer {
  100% {
    mask-position: -200% 0;
  }
}
</style>

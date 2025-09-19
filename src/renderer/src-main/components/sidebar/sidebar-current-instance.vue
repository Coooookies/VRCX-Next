<script setup lang="ts">
import ImageVRChatContext from '@renderer/shared/components/image-vrchat-context.vue'
import { Button } from '@renderer/shared/components/ui/button'
import { Skeleton } from '@renderer/shared/components/ui/skeleton'
import { ImageFallback, ImageRoot } from '@renderer/shared/components/ui/image'
import { ImageIcon } from 'lucide-vue-next'
import { cn } from '@renderer/shared/utils/style'

const props = defineProps<{
  active?: boolean
}>()
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
      <div class="relative size-7.5 shrink-0">
        <div
          :class="
            cn(
              'size-full rounded-full p-1 transition-colors duration-150',
              'after:inset-0 after:absolute after:rounded-full after:border-2 after:border-muted',
              'after:border-white after:mask-x-from-50% after:mask-x-to-75% after:mask-size-[200%_100%]',
              'after:animate-[animation-mask-shimmer_1.5s_infinite_linear]'
            )
          "
        >
          <ImageRoot class="block bg-popover size-full rounded-full overflow-hidden">
            <ImageVRChatContext
              :file-id="'file_5b4b96dc-8cf1-4a67-850c-94736ca9e5a0'"
              :version="2"
              :size="128"
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
        </div>
      </div>
      <div
        :class="
          cn(
            'w-60 h-full flex items-center pl-3.5 transition-[opacity,translate] duration-300 ease-[cubic-bezier(.16,1,.3,1)]',
            'group-has-[*]/sidebar-expanded:translate-x-0 group-has-[*]/sidebar-expanded:opacity-100',
            'group-hover/sidebar-collapsed:translate-x-0 group-hover/sidebar-collapsed:opacity-100 -translate-x-1 opacity-0'
          )
        "
      >
        <span
          :class="
            cn(
              'absolute font-medium whitespace-nowrap max-w-full pr-5 truncate',
              'text-sidebar-foreground/55 group-hover/sidebar-button:text-sidebar-foreground/70',
              'dark:text-sidebar-foreground/45 group-hover/sidebar-button:dark:text-sidebar-foreground/65',
              'transition-[color,font-weight] duration-200 ease-in-out',
              props.active &&
                'font-bold !text-sidebar-foreground/85 dark:!text-sidebar-foreground/90'
            )
          "
        >
          Japan Shrine[early autumn]
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

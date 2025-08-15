<script setup lang="ts">
import ScrollContainer from '@renderer/shared/components/scroll-container.vue'
import ImageVRChatContext from '@renderer/shared/components/image-vrchat-context.vue'
import AuthCredentialsComboItem from './auth-credentials-combo-item.vue'
import { cn } from '@renderer/shared/utils/style'
import { computed } from 'vue'
import { Button } from '@renderer/shared/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/shared/components/ui/popover'
import { ImageRoot, ImageFallback } from '@renderer/shared/components/ui/image'
import { ChevronsUpDownIcon, CircleUserRoundIcon } from 'lucide-vue-next'
import type { ButtonProps } from '@renderer/shared/components/ui/button/Button.vue'
import type { AuthenticationCredentialEntity } from '@shared/definition/vrchat-authentication'

const currentItem = computed(() => props.items.find((item) => item.userId === props.value))

const props = withDefaults(
  defineProps<
    ButtonProps & {
      open: boolean
      items: AuthenticationCredentialEntity[]
      value: string
    }
  >(),
  {}
)

const emits = defineEmits<{
  (e: 'update:open', open: boolean): void
  (e: 'update:value', userId: string): void
  (e: 'delete', userId: string): void
}>()

const handleSelect = (userId: string) => {
  emits('update:value', userId)
  emits('update:open', false)
}
</script>

<template>
  <Popover :open="props.open" @update:open="emits('update:open', $event)">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn('w-full h-14 justify-start px-2 gap-3', props.class)"
        :disabled="props.disabled"
      >
        <ImageRoot class="block size-8 bg-muted rounded-full overflow-hidden">
          <ImageVRChatContext
            v-if="currentItem"
            class="size-full object-cover"
            :file-id="currentItem.profileIconFileId"
            :version="currentItem.profileIconFileVersion"
          />
          <ImageFallback class="size-full flex items-center justify-center">
            <CircleUserRoundIcon class="size-4 text-muted-foreground" />
          </ImageFallback>
        </ImageRoot>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">
            {{ currentItem ? currentItem.displayName : 'Unknown' }}
          </span>
          <span v-if="currentItem" className="text-muted-foreground truncate text-xs">
            {{ currentItem.userName }}
          </span>
        </div>
        <ChevronsUpDownIcon class="text-muted-foreground ml-auto" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-80 p-0 rounded-md" :align="'start'">
      <ScrollContainer class="w-full max-h-64">
        <div class="p-1">
          <AuthCredentialsComboItem
            v-for="item in props.items"
            :key="item.userId"
            :user-id="item.userId"
            :user-name="item.userName"
            :display-name="item.displayName"
            :profile-icon-file-id="item.profileIconFileId"
            :profile-icon-file-version="item.profileIconFileVersion"
            :checked="item.userId === props.value"
            @select="handleSelect(item.userId)"
            @delete="emits('delete', item.userId)"
          />
        </div>
      </ScrollContainer>
    </PopoverContent>
  </Popover>
</template>

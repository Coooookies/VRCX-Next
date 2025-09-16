<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/shared/components/ui/tooltip'
import { computed } from 'vue'
import { useI18n } from '@renderer/shared/locale'
import { SOCIAL_PATTERN_MAPPING } from '@renderer/shared/constants/social-mapping'
import type { SocialPatternItem } from '@renderer/shared/constants/social-mapping'
import { Button } from '../ui/button'

const { t } = useI18n()

const props = defineProps<{
  href: string
}>()

const socialItem = computed<SocialPatternItem>(() => {
  for (const [, item] of Object.entries(SOCIAL_PATTERN_MAPPING)) {
    if (item.pattern(props.href)) {
      return item
    }
  }

  return SOCIAL_PATTERN_MAPPING.other
})
</script>

<template>
  <TooltipProvider :delay-duration="500">
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="ghost" class="!bg-transparent !p-0 rounded-[3px] size-4.5">
          <component :is="socialItem.icon" class="size-full block" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{{ t(socialItem.label) }}</p>
        <p>{{ props.href }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import PhoneIcon from '@shared/assets/vector/profile-icon-phone.svg?component'
import { computed } from 'vue'
import { useI18n } from '@renderer/shared/locale'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/shared/components/ui/tooltip'
import { Button } from '@renderer/shared/components/ui/button'
import { PLATFORM_MAPPING } from '@renderer/shared/constants/platform-mapping'

const { t } = useI18n()

const props = defineProps<{
  platform: keyof typeof PLATFORM_MAPPING
}>()

const platformDefinition = computed(() => {
  return PLATFORM_MAPPING[props.platform]
})
</script>

<template>
  <TooltipProvider :delay-duration="500">
    <Tooltip>
      <TooltipTrigger as-child>
        <Button size="icon" variant="ghost" class="size-5 rounded-sm">
          <PhoneIcon class="text-muted-foreground/50 size-3 shrink-0" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{{ t(platformDefinition.label) }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

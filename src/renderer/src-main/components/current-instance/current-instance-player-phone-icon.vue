<script setup lang="ts">
import PhoneIcon from '@shared/assets/vector/profile-icon-phone.svg?component'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/shared/components/ui/tooltip'
import { Platform } from '@shared/definition/vrchat-api-response'
import { Button } from '@renderer/shared/components/ui/button'

const props = defineProps<{
  platform?: Platform
}>()
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
        <p>{{ props.platform }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

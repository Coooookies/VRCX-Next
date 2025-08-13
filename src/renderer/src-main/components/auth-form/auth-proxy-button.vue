<script setup lang="ts">
import { Button } from '@renderer/shared/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/shared/components/ui/tooltip'
import { NetworkIcon } from 'lucide-vue-next'
import { NetworkProxyModal } from '@renderer/shared/components/network-proxy'
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <NetworkProxyModal>
        <TooltipTrigger as-child>
          <Button size="icon" variant="outline">
            <NetworkIcon />
          </Button>
        </TooltipTrigger>
      </NetworkProxyModal>
      <TooltipContent>
        <p>Proxy Settings</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

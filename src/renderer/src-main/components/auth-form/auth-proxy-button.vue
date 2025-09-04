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
import { useI18n } from '@renderer/shared/locale'

const { t } = useI18n()
</script>

<template>
  <TooltipProvider :delay-duration="500">
    <Tooltip>
      <NetworkProxyModal>
        <TooltipTrigger as-child>
          <Button size="icon" variant="outline">
            <NetworkIcon />
          </Button>
        </TooltipTrigger>
      </NetworkProxyModal>
      <TooltipContent>
        <p>{{ t('setting.network.proxy_settings_title') }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

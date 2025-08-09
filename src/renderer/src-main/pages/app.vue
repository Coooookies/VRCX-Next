<script setup lang="ts">
import { useModule } from '@renderer/shared/hooks/use-module'
import { Button } from '@renderer/shared/components/ui/button'
import type { VRChatAuthentication } from '@renderer/shared/modules/vrchat-authentication'

const auth = useModule<VRChatAuthentication>('VRChatAuthentication')

function reset(): void {
  auth.signout()
}
</script>

<template>
  <div class="w-full h-full">
    <Button @click="reset">Reset</Button>
  </div>
</template>

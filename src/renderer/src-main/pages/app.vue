<script setup lang="ts">
import { useModule } from '@renderer/shared/hooks/use-module'
import { Button } from '@renderer/shared/components/ui/button'
import type { VRChatAuthentication } from '@renderer/shared/modules/vrchat-authentication'

const auth = useModule<VRChatAuthentication>('VRChatAuthentication')

function reset(): void {
  auth.signout()
}

function logout(): void {
  auth.logout()
}
</script>

<template>
  <div class="w-full h-full flex justify-center items-center flex-row gap-2">
    <Button @click="reset">Reset</Button>
    <Button variant="outline" @click="logout">Logout</Button>
  </div>
</template>

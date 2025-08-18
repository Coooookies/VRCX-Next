<script setup lang="ts">
import AppRoute from '../layouts/app-route.vue'
import { useModule } from '@renderer/shared/hooks/use-module'
import { Button } from '@renderer/shared/components/ui/button'
import type { VRChatFriends } from '@renderer/shared/modules/vrchat-friends'
import type { VRChatAuthentication } from '@renderer/shared/modules/vrchat-authentication'

const auth = useModule<VRChatAuthentication>('VRChatAuthentication')
const friends = useModule<VRChatFriends>('VRChatFriends')

function reset(): void {
  auth.signout()
}

function logout(): void {
  auth.logout()
}
</script>

<template>
  <AppRoute>
    <div class="w-full h-60 flex flex-row items-center justify-center gap-2">
      <p>{{ friends.friends.value.length }} | {{ friends.state.loading }}</p>
      <Button @click="reset">Reset</Button>
      <Button variant="outline" @click="logout">Logout</Button>
    </div>
  </AppRoute>
</template>

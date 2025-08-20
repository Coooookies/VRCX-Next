<script setup lang="ts">
import AppRoute from '../layouts/app-route.vue'
import { computed } from 'vue'
import { useModule } from '@renderer/shared/hooks/use-module'
import { Button } from '@renderer/shared/components/ui/button'
import type { VRChatAuthentication } from '@renderer/shared/modules/vrchat-authentication'
import type { VRChatUsers } from '@renderer/shared/modules/vrchat-users'

const auth = useModule<VRChatAuthentication>('VRChatAuthentication')
const users = useModule<VRChatUsers>('VRChatUsers')

const userJson = computed(() => {
  return users.state.user ? JSON.stringify(users.state.user, null, 2) : 'null'
})

const locationJson = computed(() => {
  return users.state.location ? JSON.stringify(users.state.location, null, 2) : 'null'
})

function reset(): void {
  auth.signout()
}

function logout(): void {
  auth.logout()
}
</script>

<template>
  <AppRoute>
    <div class="px-10 py-10 space-y-6">
      <div class="w-full flex flex-row items-center gap-2">
        <Button @click="reset">Reset</Button>
        <Button variant="outline" @click="logout">Logout</Button>
      </div>
      <div class="bg-white/5 p-4 rounded-md">
        <p class="whitespace-pre-wrap text-xs">{{ userJson }}</p>
      </div>
      <div class="bg-white/5 p-4 rounded-md">
        <p class="whitespace-pre-wrap text-xs">{{ locationJson }}</p>
      </div>
    </div>
  </AppRoute>
</template>

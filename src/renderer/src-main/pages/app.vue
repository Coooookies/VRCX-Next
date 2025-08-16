<script setup lang="ts">
import AppLayout from '../layouts/app-layout.vue'
import LeftSidebar from '../components/sidebar/left-sidebar.vue'
import RightSidebar from '../components/sidebar/right-sidebar.vue'
import { ref } from 'vue'
import { useModule } from '@renderer/shared/hooks/use-module'
import { Button } from '@renderer/shared/components/ui/button'
import type { VRChatAuthentication } from '@renderer/shared/modules/vrchat-authentication'
import AppRoute from '../layouts/app-route.vue'

const auth = useModule<VRChatAuthentication>('VRChatAuthentication')
const leftExpandWidth = 264
const rightExpandWidth = 264
const collapseWidth = 72
const leftExpanded = ref(false)
const rightExpanded = ref(false)

function reset(): void {
  auth.signout()
}

function logout(): void {
  auth.logout()
}
</script>

<template>
  <AppLayout
    :left-expanded="leftExpanded"
    :right-expanded="rightExpanded"
    :left-expand-width="leftExpandWidth"
    :right-expand-width="rightExpandWidth"
    :collapse-width="collapseWidth"
  >
    <template #left-sidebar>
      <LeftSidebar
        v-model:expanded="leftExpanded"
        :expand-width="leftExpandWidth"
        :collapse-width="collapseWidth"
      />
    </template>
    <template #content>
      <AppRoute>
        <div class="w-full h-60 flex flex-row items-center justify-center gap-2">
          <Button @click="reset">Reset</Button>
          <Button variant="outline" @click="logout">Logout</Button>
        </div>
      </AppRoute>
    </template>
    <template #right-sidebar>
      <RightSidebar
        v-model:expanded="rightExpanded"
        :expand-width="rightExpandWidth"
        :collapse-width="collapseWidth"
      />
    </template>
  </AppLayout>
</template>

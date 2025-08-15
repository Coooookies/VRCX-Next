<script setup lang="ts">
import AppLayout from '../layouts/app-layout.vue'
import LeftSidebar from '../components/sidebar/left-sidebar.vue'
import RightSidebar from '../components/sidebar/right-sidebar.vue'
import { ref } from 'vue'
import { useModule } from '@renderer/shared/hooks/use-module'
import { Button } from '@renderer/shared/components/ui/button'
import type { VRChatAuthentication } from '@renderer/shared/modules/vrchat-authentication'

const auth = useModule<VRChatAuthentication>('VRChatAuthentication')
const expandWidth = 280
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
    :expand-width="expandWidth"
    :collapse-width="collapseWidth"
  >
    <template #left-sidebar>
      <LeftSidebar
        v-model:expanded="leftExpanded"
        :expand-width="expandWidth"
        :collapse-width="collapseWidth"
      />
    </template>
    <template #content>
      <div class="w-full h-full flex justify-center items-center flex-row gap-2">
        <Button @click="reset">Reset</Button>
        <Button variant="outline" @click="logout">Logout</Button>
      </div>
    </template>
    <template #right-sidebar>
      <RightSidebar
        v-model:expanded="rightExpanded"
        :expand-width="expandWidth"
        :collapse-width="collapseWidth"
      />
    </template>
  </AppLayout>
</template>

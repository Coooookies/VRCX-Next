<script setup lang="ts">
import AppLayout from '../layouts/app-layout.vue'
import SidebarLeft from '../components/sidebar/sidebar-left.vue'
import SidebarRight from '../components/sidebar/sidebar-right.vue'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SlideRouterView } from '../components/router-view'

const router = useRouter()
const route = useRoute()

const leftExpandWidth = 260
const leftExpanded = ref(false)
const rightExpandWidth = 310
const rightExpanded = ref(false)
const collapseWidth = 72

const routeName = computed(() => route.name?.toString() || '')
const routeTo = (name: string) => {
  if (routeName.value !== name) {
    router.push({ name })
  }
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
      <SidebarLeft
        v-model:expanded="leftExpanded"
        :expand-width="leftExpandWidth"
        :collapse-width="collapseWidth"
        :active-route-name="routeName"
        @update:active-route-name="routeTo"
      />
    </template>
    <template #content>
      <SlideRouterView />
    </template>
    <template #right-sidebar>
      <SidebarRight
        v-model:expanded="rightExpanded"
        :expand-width="rightExpandWidth"
        :collapse-width="collapseWidth"
        :active-route-name="routeName"
        @update:active-route-name="routeTo"
      />
    </template>
  </AppLayout>
</template>

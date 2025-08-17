<script setup lang="ts">
import AppLayout from '../layouts/app-layout.vue'
import LeftSidebar from '../components/sidebar/left-sidebar.vue'
import RightSidebar from '../components/sidebar/right-sidebar.vue'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SlideRouterView } from '../components/router-view'

const router = useRouter()
const route = useRoute()

const leftExpandWidth = 264
const leftExpanded = ref(false)
const rightExpandWidth = 264
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
      <LeftSidebar
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
      <RightSidebar
        v-model:expanded="rightExpanded"
        :expand-width="rightExpandWidth"
        :collapse-width="collapseWidth"
        :active-route-name="routeName"
        @update:active-route-name="routeTo"
      />
    </template>
  </AppLayout>
</template>

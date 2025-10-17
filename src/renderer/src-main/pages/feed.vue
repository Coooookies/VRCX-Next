<script setup lang="ts">
import ImageSelectionContext from '@renderer/shared/components/image-selection-context.vue'
import AppRoute from '../layouts/app-route.vue'
import { ImageRoot, ImageFallback } from '@renderer/shared/components/ui/image'
</script>

<template>
  <AppRoute>
    <ImageRoot class="block w-200">
      <ImageSelectionContext
        selection-id="imgsel_df5dbb9d-a21a-4d47-9e3f-5bf1e8fde8d9"
        :size="200"
        class="size-full object-cover"
      />
      <ImageFallback class="size-full flex items-center justify-center">
        <p>none</p>
      </ImageFallback>
    </ImageRoot>
  </AppRoute>
</template>

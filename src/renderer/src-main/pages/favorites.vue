<script setup lang="ts">
import FavoriteCollectionButton from '../components/favorite/favorite-collection-button.vue'
import FavoriteCollectionGroup from '../components/favorite/favorite-collection-group.vue'
import AppRoute from '../layouts/app-route.vue'
import { cn } from '@renderer/shared/utils/style'
</script>

<template>
  <AppRoute>
    <div class="@container pt-19 w-full">
      <div :class="cn('relative mx-auto w-full px-10', '@7xl:w-300 @7xl:px-0')">
        <h3 class="font-bold text-3xl">Favorites</h3>
        <div :class="cn('mt-10 grid gap-8 grid-cols-1', '@5xl:grid-cols-2')">
          <FavoriteCollectionGroup description="Worlds">
            <FavoriteCollectionButton />
            <FavoriteCollectionButton />
            <FavoriteCollectionButton />
            <FavoriteCollectionButton />
          </FavoriteCollectionGroup>
          <FavoriteCollectionGroup description="Friends">
            <FavoriteCollectionButton />
            <FavoriteCollectionButton />
            <FavoriteCollectionButton />
          </FavoriteCollectionGroup>
          <FavoriteCollectionGroup description="Avatars">
            <FavoriteCollectionButton />
          </FavoriteCollectionGroup>
        </div>
      </div>
    </div>
  </AppRoute>
</template>

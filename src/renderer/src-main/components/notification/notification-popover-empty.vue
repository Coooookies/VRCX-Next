<script setup lang="ts">
import NotificationEmptyIllustration from '@shared/assets/vector/notification-empty-illustration.svg?component'
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <NotificationEmptyIllustration class="text-primary -mb-4" />
    <div class="w-2/3 space-y-0.5 pb-12">
      <p class="font-semibold text-center">暂时没有通知</p>
      <p class="text-sm text-muted-foreground text-center">这里似乎非常安静</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@renderer/shared/locale'
import NotificationEmptyIllustration from '@shared/assets/vector/notification-empty-illustration.svg?component'

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <NotificationEmptyIllustration class="text-primary -mb-4" />
    <div class="w-2/3 space-y-0.5 pb-12">
      <p class="font-semibold text-center">{{ t('notification.empty_title') }}</p>
      <p class="text-sm text-muted-foreground text-center">
        {{ t('notification.empty_description') }}
      </p>
    </div>
  </div>
</template>

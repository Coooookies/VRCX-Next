<script setup lang="ts">
import { useI18n } from '@renderer/shared/locale'
import { cn } from '@renderer/shared/utils/style'

const { t } = useI18n()
</script>

<template>
  <div
    :class="
      cn(
        'after:border-border relative text-center text-sm',
        'after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'
      )
    "
  >
    <span class="bg-background text-xs text-muted-foreground relative z-10 px-2">
      {{ t('authentication.global.or') }}
    </span>
  </div>
</template>

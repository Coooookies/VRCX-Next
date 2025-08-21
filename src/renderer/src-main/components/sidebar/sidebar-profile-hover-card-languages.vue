<script setup lang="ts">
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@renderer/shared/components/ui/hover-card'
import { LANGUAGE_DEFINITION_KEY } from '@renderer/shared/constants/locate-mapping'
import { useI18n } from '@renderer/shared/locale'
import { UserLanguage } from '@shared/definition/vrchat-users'

const { t } = useI18n()

const props = defineProps<{
  languages: UserLanguage[]
}>()
</script>

<template>
  <div class="w-fit flex flex-row gap-1 px-2.5 py-1.5 rounded-full bg-input/30">
    <HoverCard v-for="language in props.languages" :key="language" :open-delay="0" :close-delay="0">
      <HoverCardTrigger>
        <component :is="LANGUAGE_DEFINITION_KEY[language].icon" class="size-4.5" />
      </HoverCardTrigger>
      <HoverCardContent class="w-auto px-2 py-1 text-xs">
        {{ t(LANGUAGE_DEFINITION_KEY[language].label) }}
      </HoverCardContent>
    </HoverCard>
  </div>
</template>

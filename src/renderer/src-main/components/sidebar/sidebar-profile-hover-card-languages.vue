<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/shared/components/ui/tooltip'
import { LANGUAGE_DEFINITION_KEY } from '@renderer/shared/constants/profile-mapping'
import { useI18n } from '@renderer/shared/locale'
import { UserLanguage } from '@shared/definition/vrchat-users'

const { t } = useI18n()

const props = defineProps<{
  languages: UserLanguage[]
}>()
</script>

<template>
  <div class="w-fit flex flex-row gap-1 px-2.5 py-1.5 rounded-full bg-input/30">
    <TooltipProvider v-for="language in props.languages" :key="language" :delay-duration="500">
      <Tooltip>
        <TooltipTrigger as-child>
          <component :is="LANGUAGE_DEFINITION_KEY[language].icon" class="size-4.5" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ t(LANGUAGE_DEFINITION_KEY[language].label) }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>

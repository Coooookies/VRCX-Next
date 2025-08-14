<script setup lang="ts">
import { computed } from 'vue'
import { useModule } from '@renderer/shared/hooks/use-module'
import { useI18n } from '@renderer/shared/locale'
import { Button } from '@renderer/shared/components/ui/button'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
  ComboboxViewport
} from '@renderer/shared/components/ui/combobox'
import { CheckIcon, ChevronsUpDownIcon, LanguagesIcon } from 'lucide-vue-next'
import { LANGUAGE_ITEMS } from '@shared/locale'
import type { HTMLAttributes } from 'vue'
import type { SettingModule } from '../../modules/setting'
import type { AcceptableValue, ComboboxContentProps } from 'reka-ui'
import type { LanguageAvailableCode } from '@shared/locale/types'

interface LanguageItem {
  label: string
  value: LanguageAvailableCode
}

const { t } = useI18n()
const props = defineProps<ComboboxContentProps & { contentClass?: HTMLAttributes['class'] }>()
const setting = useModule<SettingModule>('SettingModule')

const selectedLanguage = computed<LanguageItem | undefined>(() => {
  return LANGUAGE_ITEMS.find((item) => item.value === setting.state.appearance.language)
})

const onUpdateLanguage = (value: AcceptableValue) => {
  const language = value as LanguageItem
  setting.update('appearance', 'language', language.value)
}
</script>

<template>
  <Combobox :model-value="selectedLanguage" by="label" @update:model-value="onUpdateLanguage">
    <ComboboxAnchor as-child>
      <ComboboxTrigger as-child>
        <Button variant="outline" class="w-40 justify-between">
          <div class="flex flex-row items-center gap-x-2 overflow-hidden">
            <LanguagesIcon />
            <span class="truncate">
              {{ selectedLanguage?.label ?? t('setting.locale.select_placeholder') }}
            </span>
          </div>
          <ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxList
      :class="props.contentClass"
      :align="props.align"
      :side-offset="props.sideOffset"
      @focus-outside.prevent
    >
      <ComboboxInput :placeholder="t('setting.locale.search_input_placeholder')" />
      <ComboboxViewport class="max-h-80">
        <ComboboxEmpty>{{ t('setting.locale.search_result_empty') }}</ComboboxEmpty>
        <ComboboxGroup>
          <ComboboxItem
            v-for="language in LANGUAGE_ITEMS"
            :key="language.value"
            :value="language"
            class="overflow-hidden"
          >
            <span class="truncate">{{ language.label }}</span>
            <ComboboxItemIndicator>
              <CheckIcon />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxViewport>
    </ComboboxList>
  </Combobox>
</template>

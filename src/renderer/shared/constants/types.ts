import type { FunctionalComponent } from 'vue'
import type { LocaleI18NKeys } from '../locale/types'

export type LanguageDefinitionItem = { icon: FunctionalComponent; label: LocaleI18NKeys }

export type SocialPatternItem = {
  label: LocaleI18NKeys
  icon: FunctionalComponent
  pattern: (href: string) => boolean
}

export type PlatformDefinitionItem = {
  label: LocaleI18NKeys
  icon: FunctionalComponent
  color: string
}

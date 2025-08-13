import { createI18n } from 'vue-i18n'
import { LANGUAGES } from '@shared/locale'
import type { TargetPaths } from '@shared/types/utils'
import type { LanguageDefinition } from '@shared/locale/types'

export const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: LANGUAGES
})

export const useI18n = () => {
  const t = (key: TargetPaths<LanguageDefinition>, value?: Record<string, unknown>) => {
    const targetKey = `definition.${key}`
    return value ? i18n.global.t(targetKey, value) : i18n.global.t(targetKey)
  }

  return {
    ...i18n.global,
    t
  }
}

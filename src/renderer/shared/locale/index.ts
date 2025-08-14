import { createI18n } from 'vue-i18n'
import { LANGUAGES } from '@shared/locale'
import type { LocaleI18NKeys } from './types'

export const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: LANGUAGES
})

export const useI18n = () => {
  const t = (key: LocaleI18NKeys, value?: Record<string, unknown>) => {
    const targetKey = `definition.${key}`
    return value ? i18n.global.t(targetKey, value) : i18n.global.t(targetKey)
  }

  return {
    ...i18n.global,
    t
  }
}

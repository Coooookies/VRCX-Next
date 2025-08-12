import { createI18n } from 'vue-i18n'
import { LanguageDefinition } from './language'
import { LANGUAGE_ZH_CN } from './language-zh-CN'
import { LANGUAGE_EN_US } from './language-en-US'
import type { TargetPaths } from '@shared/types/utils'

export const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': LANGUAGE_ZH_CN,
    'en-US': LANGUAGE_EN_US
  }
})

export const useI18n = () => {
  const t = (key: TargetPaths<LanguageDefinition>, value?: Record<string, unknown>) => {
    return value ? i18n.global.t(key, value) : i18n.global.t(key)
  }

  return {
    ...i18n.global,
    t
  }
}

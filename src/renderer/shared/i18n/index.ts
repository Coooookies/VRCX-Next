import { createI18n } from 'vue-i18n'
import { LanguageDefinition } from './language'
import { LANGUAGE_ZH_CN } from './language-zh-cn'
import { LANGUAGE_EN_US } from './language-en-us'
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

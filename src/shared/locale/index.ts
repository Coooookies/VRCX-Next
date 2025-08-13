import { LANGUAGE_EN_US } from './language-en-us'
import { LANGUAGE_JA_JP } from './language-ja-jp'
import { LANGUAGE_ZH_CNS } from './language-zh-cns'
import { LanguageAvailableCode } from './types'

export const LANGUAGES = {
  'zh-CN': LANGUAGE_ZH_CNS,
  'ja-JP': LANGUAGE_JA_JP,
  'en-US': LANGUAGE_EN_US
} as const

export const LANGUAGE_ITEMS = Object.values(LANGUAGES).map((language) => ({
  label: language.label,
  value: language.value as LanguageAvailableCode
}))

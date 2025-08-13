import { createDefaultSettingKeys } from './factory'
import { locale } from '@main/utils/locale'
import type { LanguageAvailableCode } from '@shared/locale/types'
import type { SettingDefinition, FunctionProperties } from '@shared/types/setting'

function getLocale(): LanguageAvailableCode {
  const envLocale = locale()

  switch (envLocale) {
    case 'en-US':
      return 'en-US'
    case 'zh-CHS':
    case 'zh-CN':
      return 'zh-CN'
    default:
      return 'en-US'
  }
}

export const DEFAULT_SETTING: FunctionProperties<SettingDefinition> = {
  appearance: {
    language: () => getLocale()
  },
  network: {
    proxy_enabled: () => false,
    proxy_type: () => 'http',
    proxy_host: () => '127.0.0.1',
    proxy_port: () => 7890,
    proxy_credential_username: () => '',
    proxy_credential_password: () => ''
  },
  vrchat_authentication: {
    logged_in: () => false,
    logged_in_user_id: () => '',
    auto_save_credentials: () => true
  }
}

export const DEFAULT_SETTING_KEYS = createDefaultSettingKeys()

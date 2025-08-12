import { createDefaultSettingKeys, createDefaultSettingValues } from './factory'
import type { SettingDefinition, FunctionProperties } from '@shared/types/setting'

export const DEFAULT_SETTING: FunctionProperties<SettingDefinition> = {
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
export const DEFAULT_SETTING_INSTANCE = createDefaultSettingValues()

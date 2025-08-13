import type { LanguageAvailableCode } from '@shared/locale/types'

export type FunctionProperties<T> = {
  [K in keyof T]: T[K] extends object ? FunctionProperties<T[K]> : () => T[K]
}

export type InstanceProperties<T> = {
  [N in keyof T]: {
    [K in keyof T[N]]: {
      namespace: N extends string ? N : never
      key: K extends string ? K : never
      value: T[N][K]
    }
  }[keyof T[N]]
}[keyof T]

export type SettingNamespace = keyof SettingDefinition
export type SettingKey<T extends SettingNamespace> = keyof SettingDefinition[T]
export type SettingProperty = string | number | boolean | string[]

export type ProxyState = 'disabled' | 'system_proxy' | 'custom_proxy'
export type ProxyType = 'socks' | 'http' | 'https'

export interface SettingDefinition {
  appearance: {
    language: LanguageAvailableCode
  }
  network: {
    proxy_state: ProxyState
    proxy_type: ProxyType
    proxy_host: string
    proxy_port: number
    proxy_credential_username: string
    proxy_credential_password: string
  }
  vrchat_authentication: {
    logged_in: boolean
    logged_in_user_id: string
    auto_save_credentials: boolean
  }
}

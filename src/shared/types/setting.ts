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

export type ProxyType = 'socks' | 'http' | 'https'

export interface SettingDefinition {
  network: {
    proxy_enabled: boolean
    proxy_type: ProxyType
    proxy_host: string
    proxy_port: number
    proxy_credential_username: string
    proxy_credential_password: string
  }
  vrchat_authentication: {
    logged_in: boolean
    logged_in_user_id: string
  }
}

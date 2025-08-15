import type { InstanceProperties, SettingDefinition } from '@shared/definition/setting'
import type { AuthenticationState } from '@shared/definition/vrchat-authentication'

export type IpcListenerEvents = {
  ping: [number]
}

export type IpcRendererEvent = {
  // MobxState
  'mobx-state:target:update': [namespace: string, path: string, value: unknown]

  // VRChatAuthentication
  'vrchat-authentication:state:update': [state: AuthenticationState]

  // SettingModule
  'setting-module:update': [property: InstanceProperties<SettingDefinition>]
}

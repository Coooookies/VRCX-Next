import type { AuthenticationState } from '@shared/types/vrchat-authentication'

export type IpcListenerEvents = {
  ping: [number]
}

export type IpcRendererEvent = {
  'vrchat-authentication:state:update': [AuthenticationState]
}

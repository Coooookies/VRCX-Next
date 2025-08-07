import type { IpcListenerEvents } from './events'
import type { IpcInvokeEvents } from './invokes'

export type IpcEvents = IpcListenerEvents | IpcInvokeEvents
export type { IpcRendererEvent } from './events'

import { IpcEmitter, IpcListener } from '@electron-toolkit/typed-ipc/renderer'
import { Module } from '@shared/module-constructor'
import type { IpcEvents, IpcRendererEvent } from '@shared/ipc-bridge/index'

export class IPCRenderer extends Module {
  public readonly listener = new IpcListener<IpcRendererEvent>()
  public readonly emitter = new IpcEmitter<IpcEvents>()
}

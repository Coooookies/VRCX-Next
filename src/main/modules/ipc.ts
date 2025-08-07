import {
  type IpcEventMap,
  type IpcListenEventMap,
  IpcEmitter,
  IpcListener
} from '@electron-toolkit/typed-ipc/main'
import { Module } from '@shared/module-constructor'
import type { WebContents } from 'electron'
import type { IpcEvents, IpcRendererEvent } from '@shared/ipc-bridge'

export class IPCModule<
  T extends IpcEventMap = IpcEvents,
  K extends IpcListenEventMap = IpcRendererEvent
> extends Module {
  public readonly listener = new IpcListener<T>()
  public readonly emitter = new IpcEmitter<K>()
  private readonly webContents = new Map<string, WebContents>()

  protected onDestroy(): void {
    this.listener.dispose()
  }

  public send<E extends keyof K>(channel: Extract<E, string>, ...args: K[E]): void {
    this.webContents.values().forEach((webContent) => {
      this.emitter.send(webContent, channel, ...args)
    })
  }

  public registerWebContents(namespace: string, webContents: WebContents): void {
    this.webContents.set(namespace, webContents)
  }

  public unregisterWebContents(namespace: string): void {
    this.webContents.delete(namespace)
  }
}

import { createLogger } from '@main/logger'
import {
  registerWebviewConsoloLogger,
  registerWebviewEntry,
  registerWebviewEssential
} from '@main/utils/webcontents'
import { BrowserWindow, Session, WebContents } from 'electron'
import { ProtocolServer } from './protocol-server'
import { IPCModule } from './ipc'
import { Dependency, Module } from '@shared/module-constructor'
import { RENDERER_ENTRY_PRELOAD } from '@main/constants'

export class MainWindow extends Module {
  @Dependency('IPCModule') declare private ipc: IPCModule
  @Dependency('ProtocolServer') declare private protocol: ProtocolServer

  static MAIN_WINDOW_NAME = 'Danmacat Desktop'
  static MAIN_WINDOW_PAGE_NAME = 'main'
  static MAIN_WINDOW_WIDTH = 1500
  static MAIN_WINDOW_HEIGHT = 840
  static MAIN_WINDOW_PARTITION = `partition:${MainWindow.MAIN_WINDOW_PAGE_NAME}`

  private readonly logger = createLogger(this.moduleId)
  private mainWindow: BrowserWindow | null = null

  protected onLoad(): void {
    const win = this.createWindow()
    this.mainWindow = win
    this.protocol.bindProtocolHandler(this.session!)
    this.ipc.registerWebContents(MainWindow.MAIN_WINDOW_PARTITION, win.webContents)
  }

  protected onDestroy(): void {
    this.mainWindow?.destroy()
  }

  public show(): void {
    this.mainWindow?.show()
  }

  public hide(): void {
    this.mainWindow?.hide()
  }

  // private beforeDestroy(): void {
  //   this.ipc.unregisterWebContents(MainWindow.MAIN_WINDOW_PARTITION)
  //   this.protocol.unbindProtocolHandler(this.session!)
  //   this.mainWindow = null
  // }

  private createWindow(): BrowserWindow {
    const width = MainWindow.MAIN_WINDOW_WIDTH
    const height = MainWindow.MAIN_WINDOW_HEIGHT
    const pageName = MainWindow.MAIN_WINDOW_PAGE_NAME

    const win = new BrowserWindow({
      title: MainWindow.MAIN_WINDOW_NAME,
      width: width,
      height: height,
      show: false,
      minWidth: width,
      minHeight: height,
      autoHideMenuBar: true,
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: '#00000000',
        symbolColor: '#FFFFFF',
        height: 40
      },
      backgroundColor: '#090A0C',
      webPreferences: {
        sandbox: false,
        preload: RENDERER_ENTRY_PRELOAD,
        partition: MainWindow.MAIN_WINDOW_PARTITION
      }
    })

    win.on('ready-to-show', () => {
      this.logger.info('Window loaded')
      win.show()
    })

    // win.on('close', () => {
    //   this.beforeDestroy()
    // })

    win.on('close', (event) => {
      event.preventDefault()
      win.hide()
    })

    registerWebviewEssential(win)
    registerWebviewConsoloLogger(win, this.logger)
    registerWebviewEntry(win, pageName)

    return win
  }

  get webContents(): WebContents | null {
    return this.mainWindow?.webContents || null
  }

  get session(): Session | null {
    return this.mainWindow?.webContents.session || null
  }

  get window(): BrowserWindow | null {
    return this.mainWindow || null
  }
}

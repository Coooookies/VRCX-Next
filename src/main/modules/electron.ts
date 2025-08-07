import { electronApp, optimizer } from '@electron-toolkit/utils'
import { APP_ID } from '@main/constants'
import { Module } from '@shared/module-constructor'
import { app } from 'electron'

export class ElectronModule extends Module {
  public onInit(): void {
    electronApp.setAppUserModelId(APP_ID)

    app.on('window-all-closed', () => {
      app.quit()
    })

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })
  }
}

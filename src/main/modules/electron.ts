import { electronApp, optimizer } from '@electron-toolkit/utils'
import { APP_ID } from '@main/constants'
import { Module } from '@shared/module-constructor'
import { app } from 'electron'

const appSingleInstanceLock = app.requestSingleInstanceLock()

if (!appSingleInstanceLock) {
  app.quit()
}

export class ElectronModule extends Module<{
  relaunch: (commandLine: string[], workingDirectory: string) => void
}> {
  public onInit(): void {
    electronApp.setAppUserModelId(APP_ID)

    app.on('window-all-closed', () => {
      app.quit()
    })

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    app.on('second-instance', (_, commandLine, workingDirectory) => {
      this.emit('relaunch', commandLine, workingDirectory)
    })
  }

  public relaunch() {
    app.relaunch()
    app.exit(0)
  }
}

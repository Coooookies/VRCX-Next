import { app, Menu, Tray } from 'electron'
import { Dependency, Module } from '@shared/module-constructor'
import type { MainWindow } from './main-window'

export class TrayModule extends Module {
  @Dependency('MainWindow') declare private window: MainWindow

  private tray!: Tray

  protected onInit(): void {
    const tray = new Tray('./resources/icon.png')
    const menu = Menu.buildFromTemplate([
      {
        label: 'Exit',
        type: 'normal',
        click: () => {
          this.window.window?.destroy()
          app.quit()
        }
      }
    ])
    this.tray = tray
    this.tray.setContextMenu(menu)
    this.bindEvents()
  }

  protected onDestroy(): void {
    this.tray.destroy()
  }

  private bindEvents(): void {
    this.tray.on('click', () => {
      this.window.show()
    })
  }
}

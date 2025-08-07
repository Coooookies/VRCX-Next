import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'

import AppLoader from './loader'

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('electron', electronAPI)
}

AppLoader.whenReady().then(() => {
  AppLoader.appendLoading()
})

AppLoader.whenLoaded().then(() => {
  AppLoader.removeLoading()
})

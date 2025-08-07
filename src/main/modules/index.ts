import { DemoModule } from './demo'
import { ElectronModule } from './electron'
import { ProtocolServer } from './protocol-server'
import { IPCModule } from './ipc'
import { MainWindow } from './main-window'
import { SettingModule } from './setting'
import { Database } from './database'
import { VRChatAPI } from './vrchat-api'
import { VRChatAuthentication } from './vrchat-authentication'
import type { ModuleConstructor } from '@shared/module-constructor/types'

export const APP_MODULES: Record<string, ModuleConstructor> = {
  ElectronModule,
  Database,
  SettingModule,
  MainWindow,
  ProtocolServer,
  IPCModule,
  DemoModule,
  VRChatAPI,
  VRChatAuthentication
}

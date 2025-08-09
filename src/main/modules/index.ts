import { ElectronModule } from './electron'
import { ProtocolServer } from './protocol-server'
import { IPCModule } from './ipc'
import { MobxState } from './mobx-state'
import { MainWindow } from './main-window'
import { SettingModule } from './setting'
import { Database } from './database'
import { VRChatAPI } from './vrchat-api'
import { VRChatAuthentication } from './vrchat-authentication'
import { VRChatWorkflowCoordinator } from './vrchat-workflow-coordinator'
import type { ModuleConstructor } from '@shared/module-constructor/types'

export const APP_MODULES: Record<string, ModuleConstructor> = {
  ElectronModule,
  Database,
  MobxState,
  SettingModule,
  MainWindow,
  ProtocolServer,
  IPCModule,
  VRChatAPI,
  VRChatAuthentication,
  VRChatWorkflowCoordinator
}

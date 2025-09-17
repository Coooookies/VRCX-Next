import { ElectronModule } from './electron'
import { ProtocolServer } from './protocol-server'
import { IPCModule } from './ipc'
import { MobxState } from './mobx-state'
import { MainWindow } from './main-window'
import { SettingModule } from './setting'
import { ImageSelection } from './image-selection'
import { Database } from './database'
import { ServiceMonitor } from './service-monitor'
import { VRChatAPI } from './vrchat-api'
import { VRChatAuthentication } from './vrchat-authentication'
import { VRChatLogWatcher } from './vrchat-log-watcher'
import { VRChatMiscellaneous } from './vrchat-miscellaneous'
import { VRChatWorkflowCoordinator } from './vrchat-workflow-coordinator'
import { VRChatPipeline } from './vrchat-pipeline'
import { VRChatInstances } from './vrchat-instances'
import { VRChatFiles } from './vrchat-files'
import { VRChatFriends } from './vrchat-friends'
import { VRChatUsers } from './vrchat-users'
import { VRChatWorlds } from './vrchat-worlds'
import { VRChatGroups } from './vrchat-groups'
import { VRChatNotifications } from './vrchat-notifications'
import { Runtime } from './runtime'
import type { ModuleConstructor } from '@shared/module-constructor/types'

export const APP_MODULES: Record<string, ModuleConstructor> = {
  ElectronModule,
  Database,
  MobxState,
  SettingModule,
  MainWindow,
  ProtocolServer,
  IPCModule,
  ImageSelection,
  ServiceMonitor,
  VRChatLogWatcher,
  VRChatAPI,
  VRChatMiscellaneous,
  VRChatAuthentication,
  VRChatWorkflowCoordinator,
  VRChatPipeline,
  VRChatInstances,
  VRChatFiles,
  VRChatWorlds,
  VRChatGroups,
  VRChatUsers,
  VRChatFriends,
  VRChatNotifications,
  Runtime
}

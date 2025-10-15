import { Dependency, Module } from '@shared/module-constructor'
import type { IPCModule } from '../ipc'
import type { MobxState } from '../mobx-state'
import type { Database } from '../database'
import type { VRChatAPI } from '../vrchat-api'

export class VRChatFavorites extends Module {
  @Dependency('IPCModule') declare private ipc: IPCModule
  @Dependency('MobxState') declare private mobx: MobxState
  @Dependency('Database') declare private database: Database
  @Dependency('VRChatAPI') declare private api: VRChatAPI
}

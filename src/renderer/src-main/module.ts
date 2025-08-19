import type { ModuleConstructor } from '@shared/module-constructor/types'
import { createModuleManager } from '@renderer/shared/hooks/use-module'
import { AppLoader } from '@renderer/shared/modules/loader'
import { IPCRenderer } from '@renderer/shared/modules/ipc'
import { MobxRenderer } from '@renderer/shared/modules/mobx-renderer'
import { SettingModule } from '@renderer/shared/modules/setting'
import { VRChatUsers } from '@renderer/shared/modules/vrchat-users'
import { VRChatFriends } from '@renderer/shared/modules/vrchat-friends'
import { VRChatAuthentication } from '@renderer/shared/modules/vrchat-authentication'
import { Runtime } from '@renderer/shared/modules/runtime'

const module = createModuleManager()
const modules: Record<string, ModuleConstructor> = {
  AppLoader,
  IPCRenderer,
  MobxRenderer,
  SettingModule,
  VRChatAuthentication,
  VRChatUsers,
  VRChatFriends,
  Runtime
}

for (const [identifier, mod] of Object.entries(modules)) {
  module.register(identifier, mod)
}

export { module }

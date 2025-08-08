import type { ModuleConstructor } from '@shared/module-constructor/types'
import { createModuleManager } from '@renderer/shared/hooks/use-module'
import { IPCRenderer } from '@renderer/shared/modules/ipc'
import { AppLoader } from '@renderer/shared/modules/loader'
import { VRChatAuthentication } from '@renderer/shared/modules/vrchat-authentication'

const module = createModuleManager()
const modules: Record<string, ModuleConstructor> = {
  AppLoader,
  IPCRenderer,
  VRChatAuthentication
}

for (const [identifier, mod] of Object.entries(modules)) {
  module.register(identifier, mod)
}

export { module }

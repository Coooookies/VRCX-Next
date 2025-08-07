import type { ModuleConstructor } from '@shared/module-constructor/types'
import { createModuleManager } from '@renderer/shared/hook/use-module'
import { IPCRenderer } from '@renderer/shared/modules/ipc'
import { AppLoader } from '@renderer/shared/modules/loader'

const module = createModuleManager()
const modules: Record<string, ModuleConstructor> = {
  AppLoader,
  IPCRenderer
}

for (const [identifier, mod] of Object.entries(modules)) {
  module.register(identifier, mod)
}

export { module }

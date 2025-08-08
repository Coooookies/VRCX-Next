import { Module, ModuleManager } from '@shared/module-constructor'
import { App, getCurrentInstance } from 'vue'
import type { ModuleConstructor } from '@shared/module-constructor/types'

export function createModuleManager(): {
  install(app: App): void
  resolve<T extends Module>(identifier: string): T
  register(identifier: string, module: ModuleConstructor): void
  setup(): Promise<void>
} {
  const moduleManager = new ModuleManager()

  return {
    install(app: App) {
      app.config.globalProperties.$moduleManager = moduleManager
    },
    resolve<T extends Module>(identifier: string): T {
      return moduleManager.resolve<T>(identifier)
    },
    register(identifier: string, module: ModuleConstructor): void {
      return moduleManager.register(identifier, module)
    },
    setup(): Promise<void> {
      return moduleManager.setup()
    }
  }
}

export function useModule<T extends Module>(identifier: string): T {
  const ctx = getCurrentInstance()!
  const properties = ctx.appContext.config.globalProperties
  const manager = properties.$moduleManager as ModuleManager

  if (!manager) {
    throw new Error('Module manager not found')
  }

  const currentModule = manager.resolve<T>(identifier)
  return currentModule
}

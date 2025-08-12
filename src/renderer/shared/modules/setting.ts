import { Dependency, Module } from '@shared/module-constructor'
import type { IPCRenderer } from './ipc'
import type { MobxRenderer } from './mobx-renderer'
import type { SettingDefinition, SettingKey, SettingNamespace } from '@shared/types/setting'

export class SettingModule extends Module {
  @Dependency('IPCRenderer') declare private ipc: IPCRenderer
  @Dependency('MobxRenderer') declare private mobx: MobxRenderer

  private $!: SettingDefinition

  protected onInit(): void {
    this.$ = this.mobx.use<SettingDefinition>(this.moduleId)
  }

  public get state() {
    return this.$
  }

  public async update<T extends SettingNamespace, K extends SettingKey<T>>(
    namespace: T,
    key: K,
    value: SettingDefinition[T][K]
  ) {
    return this.ipc.emitter.invoke('setting-module:update', namespace, key as never, value as never)
  }
}

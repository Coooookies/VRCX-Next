import { Dependency, Module } from '@shared/module-constructor'
import type { IPCRenderer } from './ipc'
import type { MobxRenderer } from './mobx-renderer'
import type {
  InstanceProperties,
  SettingDefinition,
  SettingKey,
  SettingNamespace
} from '@shared/definition/setting'

export class SettingModule extends Module<{
  update: (property: InstanceProperties<SettingDefinition>) => void
}> {
  @Dependency('IPCRenderer') declare private ipc: IPCRenderer
  @Dependency('MobxRenderer') declare private mobx: MobxRenderer

  private $!: SettingDefinition

  protected onInit(): void {
    this.bindEvents()
    this.$ = this.mobx.use<SettingDefinition>(this.moduleId)
  }

  private bindEvents(): void {
    this.ipc.listener.on('setting-module:update', (_, property) => {
      this.emit('update', property)
    })
  }

  public async update<T extends SettingNamespace, K extends SettingKey<T>>(
    namespace: T,
    key: K,
    value: SettingDefinition[T][K]
  ) {
    return this.ipc.emitter.invoke('setting-module:update', namespace, key as never, value as never)
  }

  public get state() {
    return this.$
  }
}

import { toJS } from 'mobx'
import { InsertResult } from 'typeorm'
import { createLogger } from '@main/logger'
import { transformEntityToPropertyInstance } from './factory'
import { Dependency, Module } from '@shared/module-constructor'
import { SettingEntity } from '../database/entities/setting'
import { SettingModuleError } from './error'
import { DEFAULT_SETTING, DEFAULT_SETTING_INSTANCE, DEFAULT_SETTING_KEYS } from './default-setting'
import type { Database } from '../database'
import type { MobxState } from '../mobx-state'
import type { IPCModule } from '../ipc'
import type {
  SettingKey,
  SettingNamespace,
  SettingDefinition,
  SettingProperty,
  InstanceProperties
} from '@shared/types/setting'

export class SettingModule extends Module<{
  update: (property: InstanceProperties<SettingDefinition>) => void
}> {
  @Dependency('Database') declare private database: Database
  @Dependency('MobxState') declare private mobx: MobxState
  @Dependency('IPCModule') declare private ipc: IPCModule

  private readonly logger = createLogger(this.moduleId)
  private setting!: SettingDefinition

  protected async onInit(): Promise<void> {
    this.initSyncStorage()
    this.bindInvokes()
    await this.preload()
  }

  private bindInvokes(): void {
    this.ipc.listener.handle('setting-module:update', (_, ...args) => {
      return this.update(...args).then(() => {})
    })
  }

  private initSyncStorage(): void {
    this.setting = this.mobx.observable(
      this.moduleId,
      DEFAULT_SETTING_INSTANCE,
      DEFAULT_SETTING_KEYS
    )
  }

  private async preload(): Promise<void> {
    const savedSettings = await this.repository.find()
    const savedSettingInstances = savedSettings.map(transformEntityToPropertyInstance)

    for (const instance of savedSettingInstances) {
      const propertyNamespace = instance.namespace as SettingNamespace
      const propertyKey = instance.key as SettingKey<typeof propertyNamespace>

      this.set(propertyNamespace, propertyKey, instance.value)
      this.logger.debug(
        'Setting property loaded:',
        `${instance.namespace}.${instance.key}`,
        instance.value
      )
    }

    for (const [namespace, properties] of Object.entries(DEFAULT_SETTING)) {
      for (const [key, value] of Object.entries(properties)) {
        const propertyNamespace = namespace as SettingNamespace
        const propertyKey = key as SettingKey<typeof propertyNamespace>

        if (this.has(propertyNamespace, propertyKey)) {
          continue
        }

        const propertyValue = value()
        const propertyEntity = new SettingEntity()
        propertyEntity.namespace = propertyNamespace
        propertyEntity.key = propertyKey
        propertyEntity.value = propertyValue

        await this.upsert(propertyEntity)

        this.set(propertyNamespace, propertyKey, propertyValue)
        this.logger.debug(
          'New Setting Property Inserted:',
          `${propertyNamespace}.${propertyKey}`,
          propertyValue
        )
      }
    }
  }

  private set<T extends SettingNamespace, K extends SettingKey<T>>(
    namespace: T,
    key: K,
    value: SettingProperty
  ): void {
    this.mobx.action(() => {
      this.setting[namespace][key] = value as SettingDefinition[T][K]
    })
  }

  private has<T extends SettingNamespace, K extends SettingKey<T>>(namespace: T, key: K): boolean {
    return namespace in this.setting && key in this.setting[namespace]
  }

  private upsert(entity: SettingEntity): Promise<InsertResult> {
    try {
      return this.repository.upsert(
        {
          namespace: entity.namespace,
          key: entity.key,
          value: entity.value
        },
        ['namespace', 'key']
      )
    } catch (error) {
      throw new SettingModuleError(
        `Failed to update setting for namespace: ${entity.namespace}, key: ${entity.key}, value: ${entity.value}`,
        error
      )
    }
  }

  public resolve<T extends SettingNamespace, K extends SettingKey<T>>(
    namespace: T,
    key: K
  ): SettingDefinition[T][K] {
    return this.setting[namespace][key]
  }

  public resolveNamespace<T extends SettingNamespace>(namespace: T): SettingDefinition[T] {
    return toJS(this.setting)[namespace]
  }

  public async update<T extends SettingNamespace, K extends SettingKey<T>>(
    namespace: T,
    key: K,
    value: SettingDefinition[T][K]
  ): Promise<InsertResult> {
    const propertyKey = key as string
    const propertyValue = value as SettingProperty
    const propertyInstance = {
      namespace,
      key,
      value
    } as InstanceProperties<SettingDefinition>

    const entity = new SettingEntity()

    entity.namespace = namespace
    entity.key = propertyKey
    entity.value = propertyValue

    const result = await this.upsert(entity)

    this.set(namespace, key, propertyValue)
    this.emit('update', propertyInstance)
    this.logger.trace(`Setting updated: ${namespace}.${propertyKey} = ${propertyValue}`)

    return result
  }

  private get repository() {
    return this.database.source.getRepository(SettingEntity)
  }
}

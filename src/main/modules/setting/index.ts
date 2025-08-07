import { InsertResult } from 'typeorm'
import { createLogger } from '@main/logger'
import { transformEntityToPropertyInstance } from './transform'
import { Dependency, Module } from '@shared/module-constructor'
import { SettingEntity } from '../database/entities/setting'
import { SettingModuleError } from './error'
import { DEFAULT_SETTING } from './default-setting'
import type { Database } from '../database'
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

  private readonly logger = createLogger(this.moduleId)
  private readonly setting = new Map<string, SettingProperty>()

  protected async onInit(): Promise<void> {
    await this.preload()
  }

  private async preload(): Promise<void> {
    const savedSettings = await this.database.settingRepository.find()
    const savedSettingInstances = savedSettings.map(transformEntityToPropertyInstance)

    for (const instance of savedSettingInstances) {
      this.set(`${instance.namespace}.${instance.key}`, instance.value)
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
        const accessKey = this.buildAccessKey(propertyNamespace, propertyKey)

        if (this.has(propertyNamespace, propertyKey)) {
          continue
        }

        const propertyValue = value()
        const propertyEntity = new SettingEntity()
        propertyEntity.namespace = propertyNamespace
        propertyEntity.key = propertyKey
        propertyEntity.value = propertyValue

        await this.upsert(propertyEntity)

        this.set(accessKey, propertyValue)
        this.logger.debug(
          'New Setting Property Inserted:',
          `${propertyNamespace}.${propertyKey}`,
          propertyValue
        )
      }
    }
  }

  private buildAccessKey<T extends SettingNamespace, K extends SettingKey<T>>(
    namespace: T,
    key: K
  ): string {
    return `${namespace}.${key as string}`
  }

  private set(key: string, value: SettingProperty): void {
    this.setting.set(key, value)
  }

  private has<T extends SettingNamespace, K extends SettingKey<T>>(namespace: T, key: K): boolean {
    return this.setting.has(this.buildAccessKey(namespace, key))
  }

  private upsert(entity: SettingEntity): Promise<InsertResult> {
    try {
      return this.database.settingRepository.upsert(
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
    return this.setting.get(this.buildAccessKey(namespace, key)) as SettingDefinition[T][K]
  }

  public resolveNamespace<T extends SettingNamespace>(namespace: T): SettingDefinition[T] {
    const result = {} as SettingDefinition[T]

    for (const [key, value] of this.setting.entries()) {
      if (key.startsWith(`${namespace}.`)) {
        const propertyKey = key.substring(namespace.length + 1) as SettingKey<T>
        result[propertyKey] = value as SettingDefinition[T][SettingKey<T>]
      }
    }

    return result
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
    const accessKey = this.buildAccessKey(namespace, key)

    this.set(accessKey, propertyValue)
    this.emit('update', propertyInstance)
    this.logger.debug(`Setting updated: ${namespace}.${propertyKey} = ${propertyValue}`)

    return result
  }
}

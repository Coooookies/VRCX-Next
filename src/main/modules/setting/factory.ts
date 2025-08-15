import type { SettingEntity } from '../database/entities/setting'
import type { InstanceProperties, SettingDefinition } from '@shared/definition/setting'
import type { TargetPaths } from '@shared/definition/utils'
import { DEFAULT_SETTING } from './default-setting'

export function transformEntityToPropertyInstance(
  entity: SettingEntity
): InstanceProperties<SettingDefinition> {
  return {
    namespace: entity.namespace,
    key: entity.key,
    value: entity.value
  } as InstanceProperties<SettingDefinition>
}

export function createDefaultSettingValues(): SettingDefinition {
  const result = {} as SettingDefinition

  for (const [key, value] of Object.entries(DEFAULT_SETTING)) {
    result[key] = {}
    for (const [subKey, defaultValueGenerator] of Object.entries(value)) {
      result[key][subKey] = defaultValueGenerator()
    }
  }

  return result
}

export function createDefaultSettingKeys(): TargetPaths<SettingDefinition>[] {
  const paths: TargetPaths<SettingDefinition>[] = []

  for (const [namespace, properties] of Object.entries(DEFAULT_SETTING)) {
    for (const key of Object.keys(properties)) {
      paths.push(`${namespace}.${key}` as TargetPaths<SettingDefinition>)
    }
  }

  return paths
}

import type { SettingEntity } from '../database/entities/setting'
import type { InstanceProperties, SettingDefinition } from '@shared/types/setting'

export function transformEntityToPropertyInstance(
  entity: SettingEntity
): InstanceProperties<SettingDefinition> {
  return {
    namespace: entity.namespace,
    key: entity.key,
    value: entity.value
  } as InstanceProperties<SettingDefinition>
}

import { Column, Entity, PrimaryColumn } from 'typeorm'
import { propertyTransformer } from '../transform'
import type { SettingNamespace, SettingProperty } from '@shared/definition/setting'

@Entity('settings')
export class SettingEntity {
  @PrimaryColumn({
    name: 'key',
    type: 'varchar'
  })
  declare key: string

  @PrimaryColumn({
    name: 'namespace',
    type: 'varchar'
  })
  declare namespace: SettingNamespace

  @Column({
    name: 'value',
    type: 'text',
    ...propertyTransformer
  })
  declare value: SettingProperty
}

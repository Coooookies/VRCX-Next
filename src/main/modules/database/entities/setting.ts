import { Column, Entity, PrimaryColumn } from 'typeorm'
import { propertyTransformer } from '../transform'
import type { SettingNamespace, SettingProperty } from '@shared/types/setting'

@Entity('setting')
export class SettingEntity {
  @PrimaryColumn('varchar')
  declare key: string

  @PrimaryColumn('varchar')
  declare namespace: SettingNamespace

  @Column({
    type: 'text',
    ...propertyTransformer
  })
  declare value: SettingProperty
}

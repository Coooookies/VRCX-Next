import { Entity, Column, PrimaryColumn } from 'typeorm'
import { datetimeDefault, datetimeTransformer } from '../transform'

@Entity('groups')
export class GroupEntity {
  @PrimaryColumn({
    name: 'group_id',
    type: 'varchar',
    length: 63
  })
  declare groupId: string

  @Column({
    name: 'group_name',
    type: 'text'
  })
  declare groupName: string

  @Column({
    name: 'short_code',
    type: 'text'
  })
  declare shortCode: string

  @Column({
    name: 'description',
    type: 'text'
  })
  declare description: string

  @Column({
    name: 'icon_file_id',
    type: 'text'
  })
  declare iconFileId: string

  @Column({
    name: 'icon_file_version',
    type: 'integer'
  })
  declare iconFileVersion: number

  @Column({
    name: 'banner_file_id',
    type: 'text'
  })
  declare bannerFileId: string

  @Column({
    name: 'banner_file_version',
    type: 'integer'
  })
  declare bannerFileVersion: number

  @Column({
    name: 'owner_id',
    type: 'varchar',
    length: 63
  })
  declare ownerId: string

  @Column({
    name: 'is_verified',
    type: 'boolean'
  })
  declare isVerified: boolean

  @Column({
    name: 'cache_updated_at',
    type: 'datetime',
    nullable: true,
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare cacheUpdatedAt: Date
}

import { Entity, Column, PrimaryColumn } from 'typeorm'
import { datetimeDefault, datetimeTransformer, propertyTransformer } from '../transform'
import { UserSummary, UserLanguage, UserTrustRank } from '@shared/definition/vrchat-users'

@Entity('users')
export class UserEntity implements UserSummary {
  @PrimaryColumn({
    name: 'user_id',
    type: 'varchar',
    length: 63
  })
  declare userId: string

  @Column({
    name: 'display_name',
    type: 'text'
  })
  declare displayName: string

  @Column({
    name: 'profile_icon_file_id',
    type: 'text'
  })
  declare profileIconFileId: string

  @Column({
    name: 'profile_icon_file_version',
    type: 'integer'
  })
  declare profileIconFileVersion: number

  @Column({
    name: 'trust_rank',
    type: 'varchar',
    length: 31
  })
  declare trustRank: UserTrustRank

  @Column({
    name: 'languages',
    type: 'text',
    ...propertyTransformer
  })
  declare languages: UserLanguage[]

  @Column({
    name: 'is_supporter',
    type: 'boolean'
  })
  declare isSupporter: boolean

  @Column({
    name: 'cache_updated_at',
    type: 'datetime',
    nullable: true,
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare cacheUpdatedAt?: Date
}

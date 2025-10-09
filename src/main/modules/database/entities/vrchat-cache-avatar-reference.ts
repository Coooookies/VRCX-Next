import { Entity, Column, PrimaryColumn } from 'typeorm'
import { datetimeDefault, datetimeTransformer } from '../transform'
import type { Platform } from '@shared/definition/vrchat-api-response-replenish'
import type { AvatarReferenceSummary } from '@shared/definition/vrchat-avatars'

@Entity('vrchat_cache_avatar_references')
export class AvatarReferenceEntity implements AvatarReferenceSummary {
  @PrimaryColumn({ name: 'file_id', type: 'varchar', length: 63 })
  declare fileId: string

  @Column({ name: 'file_name', type: 'text' })
  declare fileName: string

  @Column({ name: 'author_user_id', type: 'varchar', length: 63 })
  declare authorUserId: string

  @Column({ name: 'avatar_name', type: 'text', nullable: true })
  declare avatarName?: string

  @Column({ name: 'unity_version', type: 'varchar', length: 31, nullable: true })
  declare unityVersion?: string

  @Column({ name: 'asset_version', type: 'integer', nullable: true })
  declare assetVersion?: number

  @Column({ name: 'platform', type: 'varchar', length: 31, nullable: true })
  declare platform?: Platform

  @Column({ name: 'release_state', type: 'varchar', length: 31, nullable: true })
  declare releaseState?: string

  @Column({
    name: 'cache_updated_at',
    type: 'datetime',
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare cacheUpdatedAt?: Date
}

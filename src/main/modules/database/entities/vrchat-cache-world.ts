import { Entity, Column, PrimaryColumn, Index } from 'typeorm'
import { datetimeDefault, datetimeTransformer } from '../transform'
import type { ReleaseStatus } from '@shared/definition/vrchat-api-response'
import type { WorldSummary } from '@shared/definition/vrchat-worlds'

@Entity('vrchat_cache_worlds')
export class WorldEntity implements WorldSummary {
  @PrimaryColumn({ name: 'world_id', type: 'varchar', length: 63 })
  declare worldId: string

  @Index('IDX_vrchat_cache_worlds_world_name')
  @Column({ name: 'world_name', type: 'text' })
  declare worldName: string

  @Column({ name: 'version', type: 'integer' })
  declare version: number

  @Column({ name: 'author_user_id', type: 'varchar', length: 63 })
  declare authorUserId: string

  @Column({ name: 'author_user_name', type: 'text' })
  declare authorUserName: string

  @Column({ name: 'description', type: 'text' })
  declare description: string

  @Column({ name: 'image_file_id', type: 'text' })
  declare imageFileId: string

  @Column({ name: 'image_file_version', type: 'integer' })
  declare imageFileVersion: number

  @Column({ name: 'organization', type: 'text' })
  declare organization: string

  @Column({ name: 'release_status', type: 'varchar', length: 31 })
  declare releaseStatus: ReleaseStatus

  @Column({ name: 'updated_at', type: 'datetime', ...datetimeTransformer, ...datetimeDefault })
  declare updatedAt: Date

  @Column({
    name: 'cache_updated_at',
    type: 'datetime',
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare cacheUpdatedAt?: Date
}

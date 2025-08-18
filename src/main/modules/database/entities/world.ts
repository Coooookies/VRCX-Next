import { Entity, Column, PrimaryColumn } from 'typeorm'
import { datetimeDefault, datetimeTransformer } from '../transform'
import type { ReleaseStatus } from '@shared/definition/vrchat-api-response'

@Entity('worlds')
export class WorldEntity {
  @PrimaryColumn({
    name: 'world_id',
    type: 'varchar',
    length: 63
  })
  declare worldId: string

  @Column({
    name: 'world_name',
    type: 'text'
  })
  declare worldName: string

  @Column({
    name: 'author_id',
    type: 'varchar',
    length: 63
  })
  declare authorId: string

  @Column({
    name: 'author_name',
    type: 'text'
  })
  declare authorName: string

  @Column({
    name: 'description',
    type: 'text'
  })
  declare description: string

  @Column({
    name: 'image_file_id',
    type: 'text'
  })
  declare imageFileId: string

  @Column({
    name: 'image_file_version',
    type: 'integer'
  })
  declare imageFileVersion: number

  @Column({
    name: 'organization',
    type: 'text'
  })
  declare organization: string

  @Column({
    name: 'release_status',
    type: 'varchar',
    length: 31
  })
  declare releaseStatus: ReleaseStatus

  @Column({
    name: 'updated_at',
    type: 'datetime',
    nullable: true,
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare updatedAt: Date

  @Column({
    name: 'cache_updated_at',
    type: 'datetime',
    nullable: true,
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare cacheUpdatedAt: Date
}

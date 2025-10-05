import { Entity, Column, PrimaryColumn } from 'typeorm'
import { datetimeDefault, datetimeTransformer } from '../transform'

@Entity('vrchat_cache_avatar_references')
export class AvatarReferenceEntity {
  @PrimaryColumn({ name: 'file_id', type: 'varchar', length: 63 })
  declare fileId: string

  @Column({ name: 'avatar_name', type: 'text' })
  declare avatarName: string

  @Column({ name: 'author_user_id', type: 'varchar', length: 63 })
  declare authorUserId: string

  @Column({
    name: 'cache_updated_at',
    type: 'datetime',
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare cacheUpdatedAt?: Date
}

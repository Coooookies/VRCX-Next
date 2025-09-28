import { Entity, Column, PrimaryColumn } from 'typeorm'
import { datetimeDefault, datetimeTransformer, propertyTransformer } from '../transform'
import { FileType } from '@main/modules/vrchat-files/types'

@Entity('vrchat_cache_analysis_files')
export class FileAnalysisEntity {
  @PrimaryColumn({
    name: 'file_id',
    type: 'varchar',
    length: 63
  })
  declare fileId: string

  @PrimaryColumn({
    name: 'file_version',
    type: 'integer'
  })
  declare fileVersion: number

  @Column({
    name: 'file_size',
    type: 'integer'
  })
  declare fileSize: number

  @Column({
    name: 'file_uncompressed_size',
    type: 'integer'
  })
  declare fileUncompressedSize: number

  @Column({
    name: 'type',
    type: 'varchar',
    length: 31
  })
  declare type: FileType

  @Column({
    name: 'stats',
    type: 'text',
    ...propertyTransformer
  })
  declare stats: object

  @Column({
    name: 'cache_updated_at',
    type: 'datetime',
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare cacheUpdatedAt?: Date
}

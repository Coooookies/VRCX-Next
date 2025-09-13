import { Entity, Column, PrimaryColumn } from 'typeorm'
import { datetimeDefault, datetimeTransformer } from '../transform'

@Entity('selection_images')
export class ImageSelectionEntity {
  @PrimaryColumn({
    name: 'selection_id',
    type: 'varchar',
    length: 63
  })
  declare selectionId: string

  @Column({
    name: 'file_name',
    type: 'text'
  })
  declare fileName: string

  @Column({
    name: 'file_extension',
    type: 'text'
  })
  declare fileExtension: string

  @Column({
    name: 'path',
    type: 'text'
  })
  declare path: string

  @Column({
    name: 'macos_bookmark',
    type: 'text',
    nullable: true
  })
  declare macosBookmark?: string

  @Column({
    name: 'recorded_at',
    type: 'datetime',
    nullable: true,
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare recordedAt?: Date
}

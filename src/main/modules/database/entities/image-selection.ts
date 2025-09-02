import { Entity, Column, PrimaryColumn } from 'typeorm'
import { datetimeDefault, datetimeTransformer } from '../transform'

@Entity('image_selection')
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
    name: 'path',
    type: 'text'
  })
  declare path: string

  @Column({
    name: 'recorded_at',
    type: 'datetime',
    nullable: true,
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare recordedAt: Date
}

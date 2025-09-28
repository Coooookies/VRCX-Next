import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm'
import { datetimeDefault, datetimeTransformer, propertyTransformer } from '../transform'
import { VisitedInstanceEntity } from './vrchat-visited-instance'
import { InstanceEvents } from '@shared/definition/vrchat-instances'

@Entity('vrchat_visited_instance_common_events')
export class VisitedInstanceCommonEventEntity {
  @PrimaryColumn({
    name: 'event_id',
    type: 'varchar',
    length: 63
  })
  declare eventId: string

  @Column({
    name: 'record_id',
    type: 'varchar',
    length: 63
  })
  declare recordId: string

  @Column({
    name: 'event_type',
    type: 'varchar',
    length: 15
  })
  declare eventType: InstanceEvents

  @Column({
    name: 'raw',
    type: 'text',
    ...propertyTransformer
  })
  declare raw: object

  @Column({
    name: 'recorded_at',
    type: 'datetime',
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare recordedAt?: Date

  @ManyToOne(() => VisitedInstanceEntity, (instance) => instance.recordId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'record_id', referencedColumnName: 'recordId' })
  declare instance: VisitedInstanceEntity
}

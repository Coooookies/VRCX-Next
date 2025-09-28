import { Entity, Column, PrimaryColumn, OneToMany, Index, ManyToOne, JoinColumn } from 'typeorm'
import { datetimeDefault, datetimeTransformer, propertyTransformer } from '../transform'
import type { InstanceEvents, LocationInstanceType } from '@shared/definition/vrchat-instances'

@Entity('vrchat_visited_instances')
export class VisitedInstanceEntity {
  @PrimaryColumn({
    name: 'record_id',
    type: 'varchar',
    length: 63
  })
  declare recordId: string

  @Column({
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
    name: 'owner_id',
    type: 'varchar',
    nullable: true,
    length: 63
  })
  declare ownerId?: string

  @Column({
    name: 'owner_name',
    type: 'text',
    nullable: true
  })
  declare ownerName?: string

  @Column({
    name: 'instance_id',
    type: 'text'
  })
  declare instanceId: string

  @Column({
    name: 'instance_type',
    type: 'varchar',
    length: 15
  })
  declare instanceType: LocationInstanceType

  @Column({
    name: 'joined_at',
    type: 'datetime',
    ...datetimeTransformer
  })
  declare joinedAt: Date

  @Column({
    name: 'left_at',
    type: 'datetime',
    nullable: true,
    ...datetimeTransformer
  })
  declare leftAt?: Date

  @Column({
    name: 'recorded_at',
    type: 'datetime',
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare recordedAt?: Date

  @OneToMany(() => VisitedInstanceUserEventEntity, (event) => event.instance)
  declare userEvents: VisitedInstanceUserEventEntity[]

  @OneToMany(() => VisitedInstanceCommonEventEntity, (event) => event.instance)
  declare commonEvents: VisitedInstanceCommonEventEntity[]
}

@Entity('vrchat_visited_instance_common_events')
@Index('IDX_vrchat_visited_instance_common_events_record_id', ['recordId'])
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

  @ManyToOne(() => VisitedInstanceEntity, (instance) => instance.recordId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'record_id', referencedColumnName: 'recordId' })
  declare instance: VisitedInstanceEntity
}

@Entity('vrchat_visited_instance_user_events')
@Index('IDX_vrchat_visited_instance_user_events_record_id', ['recordId'])
@Index('IDX_vrchat_visited_instance_user_events_user_id', ['userId'])
export class VisitedInstanceUserEventEntity {
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
    name: 'user_id',
    type: 'varchar',
    length: 63
  })
  declare userId: string

  @Column({
    name: 'user_name',
    type: 'text'
  })
  declare userName: string

  @Column({
    name: 'recorded_at',
    type: 'datetime',
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare recordedAt?: Date

  @ManyToOne(() => VisitedInstanceEntity, (instance) => instance.recordId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'record_id', referencedColumnName: 'recordId' })
  declare instance: VisitedInstanceEntity
}

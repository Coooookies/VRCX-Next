import { Entity, Column, PrimaryColumn, OneToMany, Index, ManyToOne, JoinColumn } from 'typeorm'
import { datetimeDefault, datetimeTransformer, propertyTransformer } from '../transform'
import type { InstanceEvents, LocationInstanceType } from '@shared/definition/vrchat-instances'

@Entity('vrchat_visited_instances')
@Index('IDX_vrchat_visited_instances_worldId', ['refUserId', 'worldId'])
@Index('IDX_vrchat_visited_instances_worldName', ['refUserId', 'worldName'])
@Index('IDX_vrchat_visited_instances_ownerName', ['refUserId', 'ownerName'])
@Index('IDX_vrchat_visited_instances_instanceType', ['refUserId', 'instanceType'])
@Index('IDX_vrchat_visited_instances_joined_left', ['refUserId', 'joinedAt', 'leftAt'])
export class VisitedInstanceEntity {
  @PrimaryColumn({ name: 'record_id', type: 'varchar', length: 63 })
  declare recordId: string

  @Column({ name: 'world_id', type: 'varchar', length: 63 })
  declare worldId: string

  @Column({ name: 'world_name', type: 'text', nullable: true })
  declare worldName?: string

  @Column({ name: 'world_version', type: 'integer', nullable: true })
  declare worldVersion?: number

  @Index('IDX_vrchat_visited_instances_ref_user_id')
  @Column({ name: 'ref_user_id', type: 'varchar', length: 63 })
  declare refUserId: string

  @Column({ name: 'owner_id', type: 'varchar', nullable: true, length: 63 })
  declare ownerId?: string

  @Column({ name: 'owner_name', type: 'text', nullable: true })
  declare ownerName?: string

  @Column({ name: 'instance_id', type: 'text' })
  declare instanceId: string

  @Column({ name: 'instance_type', type: 'varchar', length: 15 })
  declare instanceType: LocationInstanceType

  @Column({ name: 'joined_at', type: 'datetime', ...datetimeTransformer })
  declare joinedAt: Date

  @Column({ name: 'left_at', type: 'datetime', nullable: true, ...datetimeTransformer })
  declare leftAt?: Date

  @Column({ name: 'recorded_at', type: 'datetime', ...datetimeTransformer, ...datetimeDefault })
  declare recordedAt?: Date

  @OneToMany(() => VisitedInstanceUserEventEntity, (event) => event.instance)
  declare userEvents: VisitedInstanceUserEventEntity[]

  @OneToMany(() => VisitedInstanceCommonEventEntity, (event) => event.instance)
  declare commonEvents: VisitedInstanceCommonEventEntity[]
}

@Entity('vrchat_visited_instance_common_events')
@Index('IDX_vrchat_visited_instance_common_events_record_keyword', ['recordId', 'keyword'])
export class VisitedInstanceCommonEventEntity {
  @PrimaryColumn({ name: 'event_id', type: 'varchar', length: 63 })
  declare eventId: string

  @Index('IDX_vrchat_visited_instance_common_events_record_id')
  @Column({ name: 'record_id', type: 'varchar', length: 63 })
  declare recordId: string

  @Column({ name: 'event_type', type: 'varchar', length: 15 })
  declare eventType: InstanceEvents

  @Column({ name: 'keyword', type: 'text' })
  declare keyword: string

  @Column({ name: 'raw', type: 'text', ...propertyTransformer })
  declare raw: object

  @Column({ name: 'recorded_at', type: 'datetime', ...datetimeTransformer, ...datetimeDefault })
  declare recordedAt?: Date

  @ManyToOne(() => VisitedInstanceEntity, (instance) => instance.recordId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'record_id', referencedColumnName: 'recordId' })
  declare instance: VisitedInstanceEntity
}

@Entity('vrchat_visited_instance_user_events')
@Index('IDX_vrchat_visited_instance_user_events_record_userId', ['recordId', 'userId'])
@Index('IDX_vrchat_visited_instance_user_events_record_userName', ['recordId', 'userName'])
export class VisitedInstanceUserEventEntity {
  @PrimaryColumn({ name: 'event_id', type: 'varchar', length: 63 })
  declare eventId: string

  @Index('IDX_vrchat_visited_instance_user_events_record_id')
  @Column({ name: 'record_id', type: 'varchar', length: 63 })
  declare recordId: string

  @Column({ name: 'event_type', type: 'varchar', length: 15 })
  declare eventType: InstanceEvents

  @Column({ name: 'user_id', type: 'varchar', length: 63 })
  declare userId: string

  @Column({ name: 'user_name', type: 'text' })
  declare userName: string

  @Column({ name: 'recorded_at', type: 'datetime', ...datetimeTransformer, ...datetimeDefault })
  declare recordedAt?: Date

  @ManyToOne(() => VisitedInstanceEntity, (instance) => instance.recordId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'record_id', referencedColumnName: 'recordId' })
  declare instance: VisitedInstanceEntity
}

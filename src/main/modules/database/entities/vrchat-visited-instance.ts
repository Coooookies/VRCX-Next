import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { datetimeDefault, datetimeTransformer } from '../transform'
import { VisitedInstanceUserEventEntity } from './vrchat-visited-instance-user-event'
import type { LocationInstanceType } from '@shared/definition/vrchat-instances'
import { VisitedInstanceCommonEventEntity } from './vrchat-visited-instance-common-event'

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

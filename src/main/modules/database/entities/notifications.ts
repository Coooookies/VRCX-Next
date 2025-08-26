import { Entity, Column, PrimaryColumn } from 'typeorm'
import { datetimeDefault, datetimeTransformer, propertyTransformer } from '../transform'
import type {
  NotificationGlobalRawInformation,
  NotificationGlobalType,
  NotificationSenderType
} from '@shared/definition/vrchat-notifications'

@Entity('notifications')
export class NotificationEntity<T extends NotificationGlobalType = NotificationGlobalType> {
  @PrimaryColumn({
    name: 'notification_id',
    type: 'varchar',
    length: 63
  })
  declare notificationId: string

  @Column({
    name: 'type',
    type: 'varchar',
    length: 63
  })
  declare type: T

  @Column({
    name: 'sender_id',
    type: 'varchar',
    nullable: true,
    length: 63
  })
  declare senderId: string

  @Column({
    name: 'sender_type',
    type: 'varchar',
    length: 31
  })
  declare senderType: NotificationSenderType

  @Column({
    name: 'owner_user_id',
    type: 'varchar',
    length: 63
  })
  declare ownerUserId: string

  @Column({
    name: 'title',
    type: 'text'
  })
  declare title: string

  @Column({
    name: 'message',
    type: 'text'
  })
  declare message: string

  @Column({
    name: 'raw_notification',
    type: 'text',
    ...propertyTransformer
  })
  declare rawNotification: NotificationGlobalRawInformation[T]

  @Column({
    name: 'create_at',
    type: 'datetime',
    nullable: true,
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare createAt: Date
}

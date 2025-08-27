import { Entity, Column, PrimaryColumn, Index } from 'typeorm'
import { datetimeDefault, datetimeTransformer, propertyTransformer } from '../transform'
import type {
  NotificationGlobalType,
  NotificationSenderType,
  NotificationVersion
} from '@shared/definition/vrchat-notifications'

@Entity('notifications')
@Index('IDX_notifications_owner_user_id', ['ownerUserId'])
export class NotificationEntity {
  @PrimaryColumn({
    name: 'notification_id',
    type: 'varchar',
    length: 63
  })
  declare notificationId: string

  @PrimaryColumn({
    name: 'owner_user_id',
    type: 'varchar',
    length: 63
  })
  declare ownerUserId: string

  @Column({
    name: 'type',
    type: 'varchar',
    length: 63
  })
  declare type: NotificationGlobalType

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
    name: 'is_read',
    type: 'boolean'
  })
  declare isRead: boolean

  @Column({
    name: 'thumbnail_image_url',
    type: 'text'
  })
  declare thumbnailImageUrl?: string

  @Column({
    name: 'sender_id',
    type: 'varchar',
    nullable: true,
    length: 63
  })
  declare senderId?: string

  @Column({
    name: 'sender_type',
    type: 'varchar',
    length: 31
  })
  declare senderType: NotificationSenderType

  @Column({
    name: 'version',
    type: 'varchar',
    length: 15
  })
  declare version: NotificationVersion

  @Column({
    name: 'raw',
    type: 'text',
    ...propertyTransformer
  })
  declare raw: object

  @Column({
    name: 'create_at',
    type: 'datetime',
    nullable: true,
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare createAt: Date
}

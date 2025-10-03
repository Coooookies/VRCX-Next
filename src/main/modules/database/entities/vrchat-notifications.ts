import { Entity, Column, PrimaryColumn, Index } from 'typeorm'
import { datetimeDefault, datetimeTransformer, propertyTransformer } from '../transform'
import type {
  NotificationGlobalType,
  NotificationSenderType,
  NotificationVersion
} from '@shared/definition/vrchat-notifications'

@Entity('vrchat_notifications')
export class NotificationEntity {
  @PrimaryColumn({
    name: 'notification_id',
    type: 'varchar',
    length: 63
  })
  declare notificationId: string

  @Index('IDX_vrchat_notifications_ref_user_id')
  @PrimaryColumn({
    name: 'ref_user_id',
    type: 'varchar',
    length: 63
  })
  declare refUserId: string

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
    type: 'text',
    nullable: true
  })
  declare thumbnailImageUrl?: string

  @Index('IDX_vrchat_notifications_sender_id')
  @Column({
    name: 'sender_id',
    type: 'varchar',
    nullable: true,
    length: 63
  })
  declare senderId?: string

  @Index('IDX_vrchat_notifications_sender_name')
  @Column({
    name: 'sender_name',
    type: 'text',
    nullable: true
  })
  declare senderName?: string

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
    name: 'created_at',
    type: 'datetime',
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare createdAt?: Date
}

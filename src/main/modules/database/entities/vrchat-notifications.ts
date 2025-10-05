import { Entity, Column, PrimaryColumn, Index } from 'typeorm'
import { datetimeDefault, datetimeTransformer, propertyTransformer } from '../transform'
import type {
  NotificationGlobalType,
  NotificationSenderType,
  NotificationVersion
} from '@shared/definition/vrchat-notifications'

@Entity('vrchat_notifications')
@Index('IDX_vrchat_notifications_ref_user_id_sender_id', ['refUserId', 'senderId'])
@Index('IDX_vrchat_notifications_ref_user_id_sender_name', ['refUserId', 'senderName'])
@Index('IDX_vrchat_notifications_ref_user_id_type', ['refUserId', 'type'])
@Index('IDX_vrchat_notifications_ref_user_id_sender_type', ['refUserId', 'senderType'])
@Index('IDX_vrchat_notifications_ref_user_id_created_at', ['refUserId', 'createdAt'])
export class NotificationEntity {
  @PrimaryColumn({ name: 'notification_id', type: 'varchar', length: 63 })
  declare notificationId: string

  @PrimaryColumn({ name: 'ref_user_id', type: 'varchar', length: 63 })
  declare refUserId: string

  @Column({ name: 'type', type: 'varchar', length: 63 })
  declare type: NotificationGlobalType

  @Column({ name: 'title', type: 'text' })
  declare title: string

  @Column({ name: 'message', type: 'text' })
  declare message: string

  @Column({ name: 'is_read', type: 'boolean' })
  declare isRead: boolean

  @Column({ name: 'thumbnail_image_url', type: 'text', nullable: true })
  declare thumbnailImageUrl?: string

  @Column({ name: 'sender_id', type: 'varchar', nullable: true, length: 63 })
  declare senderId?: string

  @Column({ name: 'sender_name', type: 'text', nullable: true })
  declare senderName?: string

  @Column({ name: 'sender_type', type: 'varchar', length: 31 })
  declare senderType: NotificationSenderType

  @Column({ name: 'version', type: 'varchar', length: 15 })
  declare version: NotificationVersion

  @Column({ name: 'raw', type: 'text', ...propertyTransformer })
  declare raw: object

  @Column({
    name: 'created_at',
    type: 'datetime',
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare createdAt?: Date
}

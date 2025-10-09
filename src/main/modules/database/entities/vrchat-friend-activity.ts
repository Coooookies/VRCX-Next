import { Entity, Column, PrimaryColumn, Index } from 'typeorm'
import { datetimeDefault, datetimeTransformer } from '../transform'
import type { LocationInstanceType } from '@shared/definition/vrchat-instances'
import type { FriendActivityEvents } from '@shared/definition/vrchat-friends'

@Entity('vrchat_friend_location_activities')
@Index('IDX_vrchat_friend_location_activities_activity_id', ['refUserId', 'activityId'])
@Index('IDX_vrchat_friend_location_activities_friend_user_id', ['refUserId', 'friendUserId'])
@Index('IDX_vrchat_friend_location_activities_friend_user_name', ['refUserId', 'friendUserName'])
@Index('IDX_vrchat_friend_location_activities_world_id', ['refUserId', 'worldId'])
@Index('IDX_vrchat_friend_location_activities_world_name', ['refUserId', 'worldName'])
@Index('IDX_vrchat_friend_location_activities_owner_name', ['refUserId', 'ownerName'])
@Index('IDX_vrchat_friend_location_activities_instance_type', ['refUserId', 'instanceType'])
export class FriendLocationActivityEntity {
  @PrimaryColumn({ name: 'activity_id', type: 'varchar', length: 63 })
  declare activityId: string

  @Index('IDX_vrchat_friend_location_activities_ref_user_id')
  @Column({ name: 'ref_user_id', type: 'varchar', length: 63 })
  declare refUserId: string

  @Column({ name: 'friend_user_id', type: 'varchar', length: 63 })
  declare friendUserId: string

  @Column({ name: 'friend_user_name', type: 'text', nullable: true })
  declare friendUserName?: string

  @Column({ name: 'world_id', type: 'varchar', length: 63, nullable: true })
  declare worldId?: string

  @Column({ name: 'world_name', type: 'text', nullable: true })
  declare worldName?: string

  @Column({ name: 'world_version', type: 'integer', nullable: true })
  declare worldVersion?: number

  @Column({ name: 'owner_id', type: 'varchar', nullable: true, length: 63 })
  declare ownerId?: string

  @Column({ name: 'owner_name', type: 'text', nullable: true })
  declare ownerName?: string

  @Column({ name: 'instance_id', type: 'text' })
  declare instanceId: string

  @Column({ name: 'instance_type', type: 'varchar', length: 15, nullable: true })
  declare instanceType?: LocationInstanceType

  @Column({ name: 'recorded_at', type: 'datetime', ...datetimeTransformer, ...datetimeDefault })
  declare recordedAt?: Date
}

@Entity('vrchat_friend_avatar_activities')
@Index('IDX_vrchat_friend_avatar_activities_activity_id', ['refUserId', 'activityId'])
@Index('IDX_vrchat_friend_avatar_activities_friend_user_id', ['refUserId', 'friendUserId'])
@Index('IDX_vrchat_friend_avatar_activities_friend_user_name', ['refUserId', 'friendUserName'])
@Index('IDX_vrchat_friend_avatar_activities_avatar_name', ['refUserId', 'avatarName'])
export class FriendAvatarActivityEntity {
  @PrimaryColumn({ name: 'activity_id', type: 'varchar', length: 63 })
  declare activityId: string

  @Index('IDX_vrchat_friend_avatar_activities_ref_user_id')
  @Column({ name: 'ref_user_id', type: 'varchar', length: 63 })
  declare refUserId: string

  @Column({ name: 'friend_user_id', type: 'varchar', length: 63 })
  declare friendUserId: string

  @Column({ name: 'friend_user_name', type: 'text', nullable: true })
  declare friendUserName?: string

  @Column({ name: 'avatar_image_file_id', type: 'varchar', length: 63 })
  declare avatarImagefileId: string

  @Column({ name: 'avatar_image_file_version', type: 'integer' })
  declare avatarImagefileVersion: number

  @Column({ name: 'avatar_name', type: 'text', nullable: true })
  declare avatarName?: string

  @Column({ name: 'owner_user_id', type: 'varchar', length: 63, nullable: true })
  declare ownerUserId?: string

  @Column({ name: 'recorded_at', type: 'datetime', ...datetimeTransformer, ...datetimeDefault })
  declare recordedAt?: Date
}

@Entity('vrchat_friend_common_activities')
@Index('IDX_vrchat_friend_common_activities_activity_id', ['refUserId', 'activityId'])
@Index('IDX_vrchat_friend_common_activities_activity_type', ['refUserId', 'activityType'])
@Index('IDX_vrchat_friend_common_activities_friend_user_id', ['refUserId', 'friendUserId'])
@Index('IDX_vrchat_friend_common_activities_friend_user_name', ['refUserId', 'friendUserName'])
@Index('IDX_vrchat_friend_common_activities_before_value', ['refUserId', 'beforeValue'])
@Index('IDX_vrchat_friend_common_activities_after_value', ['refUserId', 'afterValue'])
export class FriendCommonActivityEntity {
  @PrimaryColumn({ name: 'activity_id', type: 'varchar', length: 63 })
  declare activityId: string

  @Index('IDX_vrchat_friend_common_activities_ref_user_id')
  @Column({ name: 'ref_user_id', type: 'varchar', length: 63 })
  declare refUserId: string

  @Column({ name: 'friend_user_id', type: 'varchar', length: 63 })
  declare friendUserId: string

  @Column({ name: 'friend_user_name', type: 'text', nullable: true })
  declare friendUserName?: string

  @Column({ name: 'activity_type', type: 'varchar', length: 31 })
  declare activityType: FriendActivityEvents

  @Column({ name: 'before_value', type: 'text' })
  declare beforeValue: string

  @Column({ name: 'after_value', type: 'text' })
  declare afterValue: string

  @Column({ name: 'recorded_at', type: 'datetime', ...datetimeTransformer, ...datetimeDefault })
  declare recordedAt?: Date
}

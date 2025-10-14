import {
  FriendAvatarActivityEntity,
  FriendLocationActivityEntity,
  FriendCommonActivityEntity,
  FriendAttributeActivityEntity
} from '../database/entities/vrchat-friend-activity'
import type { Repository } from 'typeorm'
import type { Database } from '../database'

export class FriendsRepository {
  constructor(private readonly database: Database) {}

  public get locationActivityRepository(): Repository<FriendLocationActivityEntity> {
    return this.database.source.getRepository(FriendLocationActivityEntity)
  }

  public get avatarActivityRepository() {
    return this.database.source.getRepository(FriendAvatarActivityEntity)
  }

  public get attributeActivityRepository() {
    return this.database.source.getRepository(FriendAttributeActivityEntity)
  }

  public get commonActivityRepository() {
    return this.database.source.getRepository(FriendCommonActivityEntity)
  }

  public async saveLocationActivityEntities(
    entities: FriendLocationActivityEntity | FriendLocationActivityEntity[]
  ) {
    const entitiesArr = Array.isArray(entities) ? entities : [entities]
    return this.locationActivityRepository.upsert(entitiesArr, {
      conflictPaths: ['activityId'],
      skipUpdateIfNoValuesChanged: true
    })
  }

  public async saveAvatarActivityEntities(
    entities: FriendAvatarActivityEntity | FriendAvatarActivityEntity[]
  ) {
    const entitiesArr = Array.isArray(entities) ? entities : [entities]
    return this.avatarActivityRepository.upsert(entitiesArr, {
      conflictPaths: ['activityId'],
      skipUpdateIfNoValuesChanged: true
    })
  }

  public async saveCommonActivityEntities(
    entities: FriendCommonActivityEntity | FriendCommonActivityEntity[]
  ) {
    const entitiesArr = Array.isArray(entities) ? entities : [entities]
    return this.commonActivityRepository.upsert(entitiesArr, {
      conflictPaths: ['activityId'],
      skipUpdateIfNoValuesChanged: true
    })
  }

  public async saveAttributeActivityEntities(
    entities: FriendAttributeActivityEntity | FriendAttributeActivityEntity[]
  ) {
    const entitiesArr = Array.isArray(entities) ? entities : [entities]
    return this.attributeActivityRepository.upsert(entitiesArr, {
      conflictPaths: ['activityId'],
      skipUpdateIfNoValuesChanged: true
    })
  }
}

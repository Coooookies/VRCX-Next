import { GroupEntity } from '../database/entities/vrchat-cache-group'
import { In } from 'typeorm'
import type { Repository } from 'typeorm'
import type { Database } from '../database'

export class GroupRepository {
  constructor(private readonly database: Database) {}

  public get repository(): Repository<GroupEntity> {
    return this.database.source.getRepository(GroupEntity)
  }

  public async getSavedEntities(groupId: string): Promise<GroupEntity | null>
  public async getSavedEntities(groupIds: string[]): Promise<Map<string, GroupEntity>>
  public async getSavedEntities(
    groupIds: string | string[]
  ): Promise<GroupEntity | Map<string, GroupEntity> | null> {
    const pendingGroupId = Array.isArray(groupIds) ? groupIds : [groupIds]
    const savedEntities = await this.repository.find({
      where: {
        groupId: In(pendingGroupId)
      }
    })

    if (Array.isArray(groupIds)) {
      const entityMap = new Map<string, GroupEntity>()
      for (const entity of savedEntities) {
        entityMap.set(entity.groupId, entity)
      }
      return entityMap
    } else {
      return savedEntities.length > 0 ? savedEntities[0] : null
    }
  }

  public async saveEntities(entities: GroupEntity | GroupEntity[]) {
    const entitiesArr = Array.isArray(entities) ? entities : [entities]
    return this.repository.upsert(entitiesArr, {
      conflictPaths: ['groupId'],
      skipUpdateIfNoValuesChanged: true
    })
  }
}

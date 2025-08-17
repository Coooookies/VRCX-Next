import { WorldEntity } from '../database/entities/world'
import { In } from 'typeorm'
import type { Repository } from 'typeorm'
import type { Database } from '../database'

export class WorldRepository {
  constructor(private readonly database: Database) {}

  public get repository(): Repository<WorldEntity> {
    return this.database.source.getRepository(WorldEntity)
  }

  public async getSavedEntities(worldId: string): Promise<WorldEntity | null>
  public async getSavedEntities(worldIds: string[]): Promise<Map<string, WorldEntity>>
  public async getSavedEntities(
    worldIds: string | string[]
  ): Promise<WorldEntity | Map<string, WorldEntity> | null> {
    const pendingWorldId = Array.isArray(worldIds) ? worldIds : [worldIds]
    const savedEntities = await this.repository.find({
      where: {
        worldId: In(pendingWorldId)
      }
    })

    if (Array.isArray(worldIds)) {
      const entityMap = new Map<string, WorldEntity>()
      for (const entity of savedEntities) {
        entityMap.set(entity.worldId, entity)
      }
      return entityMap
    } else {
      return savedEntities.length > 0 ? savedEntities[0] : null
    }
  }

  public async saveEntities(entities: WorldEntity | WorldEntity[]) {
    const entitiesArr = Array.isArray(entities) ? entities : [entities]
    return this.repository.upsert(entitiesArr, {
      conflictPaths: ['worldId'],
      skipUpdateIfNoValuesChanged: true
    })
  }
}

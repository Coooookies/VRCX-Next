import { AvatarReferenceEntity } from '../database/entities/vrchat-cache-avatar-reference'
import { In } from 'typeorm'
import type { Repository } from 'typeorm'
import type { Database } from '../database'

export class AvatarRepository {
  constructor(private readonly database: Database) {}

  public get repository(): Repository<AvatarReferenceEntity> {
    return this.database.source.getRepository(AvatarReferenceEntity)
  }

  public async getSavedRefAvatarEntities(fileId: string): Promise<AvatarReferenceEntity | null>
  public async getSavedRefAvatarEntities(
    fileIds: string[]
  ): Promise<Map<string, AvatarReferenceEntity>>
  public async getSavedRefAvatarEntities(
    fileIds: string | string[]
  ): Promise<AvatarReferenceEntity | Map<string, AvatarReferenceEntity> | null> {
    const pendingFileId = Array.isArray(fileIds) ? fileIds : [fileIds]
    const savedEntities = await this.repository.find({
      where: {
        fileId: In(pendingFileId)
      }
    })

    if (Array.isArray(fileIds)) {
      const entityMap = new Map<string, AvatarReferenceEntity>()
      for (const entity of savedEntities) {
        entityMap.set(entity.fileId, entity)
      }
      return entityMap
    } else {
      return savedEntities.length > 0 ? savedEntities[0] : null
    }
  }

  public async saveRefAvatarEntities(entities: AvatarReferenceEntity | AvatarReferenceEntity[]) {
    const entitiesArr = Array.isArray(entities) ? entities : [entities]
    return this.repository.upsert(entitiesArr, {
      conflictPaths: ['fileId'],
      skipUpdateIfNoValuesChanged: true
    })
  }
}

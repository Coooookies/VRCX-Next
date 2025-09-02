import { existsSync } from 'node:fs'
import { Database } from '../database'
import { ImageSelectionEntity } from '../database/entities/image-selection'
import type { Repository } from 'typeorm'
import type { ImageSelectionInstance } from '@shared/definition/image-selection'

export class ImageSelectionRepository {
  constructor(private database: Database) {}

  public get repository(): Repository<ImageSelectionEntity> {
    return this.database.source.getRepository(ImageSelectionEntity)
  }

  public upsertSelections(entities: ImageSelectionEntity[]) {
    return this.repository.upsert(entities, {
      conflictPaths: ['selectionId'],
      skipUpdateIfNoValuesChanged: true
    })
  }

  public async resolveImageSelection(selectionId: string): Promise<ImageSelectionInstance | null> {
    const result = await this.repository.findOneBy({ selectionId })

    if (!result) {
      return null
    }

    return {
      selectionId: result.selectionId,
      fileName: result.fileName,
      fileExtension: result.fileExtension,
      exist: existsSync(result.path),
      recordedAt: result.recordedAt!
    }
  }
}

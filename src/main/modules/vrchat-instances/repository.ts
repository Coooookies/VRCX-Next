import {
  VisitedInstanceEntity,
  VisitedInstanceCommonEventEntity,
  VisitedInstanceUserEventEntity
} from '../database/entities/vrchat-visited-instance'
import type { Database } from '../database'
import type { Repository } from 'typeorm'

export class InstanceRepository {
  constructor(private readonly database: Database) {}

  public get visitedInstanceRepository(): Repository<VisitedInstanceEntity> {
    return this.database.source.getRepository(VisitedInstanceEntity)
  }

  public get visitedInstanceUserEventRepository(): Repository<VisitedInstanceUserEventEntity> {
    return this.database.source.getRepository(VisitedInstanceUserEventEntity)
  }

  public get visitedInstanceCommonEventRepository(): Repository<VisitedInstanceCommonEventEntity> {
    return this.database.source.getRepository(VisitedInstanceCommonEventEntity)
  }

  public upsertVisitedInstanceRecord(entity: VisitedInstanceEntity) {
    const option = {
      conflictPaths: ['recordId'],
      skipUpdateIfNoValuesChanged: true
    }
    return this.visitedInstanceRepository.upsert(entity, option).then(() => {})
  }

  public updateVisitedInstanceRecord(recordId: string, entity: Partial<VisitedInstanceEntity>) {
    return this.visitedInstanceRepository.update({ recordId }, entity).then(() => {})
  }

  public upsertVisitedInstanceUserEvent(
    entity: VisitedInstanceUserEventEntity | VisitedInstanceUserEventEntity[]
  ) {
    const option = {
      conflictPaths: ['eventId'],
      skipUpdateIfNoValuesChanged: true
    }
    return this.visitedInstanceUserEventRepository.upsert(entity, option).then(() => {})
  }

  public upsertVisitedInstanceCommonEvent(
    entity: VisitedInstanceCommonEventEntity | VisitedInstanceCommonEventEntity[]
  ) {
    const option = {
      conflictPaths: ['eventId'],
      skipUpdateIfNoValuesChanged: true
    }
    return this.visitedInstanceCommonEventRepository.upsert(entity, option).then(() => {})
  }
}

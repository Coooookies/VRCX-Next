import { DataSource } from 'typeorm'
import { join } from 'node:path'
import { Module } from '@shared/module-constructor'
import { DatabaseLogger } from './logger'
import { CredentialEntity } from './entities/vrchat-credential'
import { WorldEntity } from './entities/vrchat-cache-world'
import { GroupEntity } from './entities/vrchat-cache-group'
import { SettingEntity } from './entities/setting'
import { UserEntity } from './entities/vrchat-cache-users'
import {
  VisitedInstanceEntity,
  VisitedInstanceCommonEventEntity,
  VisitedInstanceUserEventEntity
} from './entities/vrchat-visited-instance'
import { NotificationEntity } from './entities/vrchat-notifications'
import { ImageSelectionEntity } from './entities/selection-images'
import { FileAnalysisEntity } from './entities/vrchat-cache-analysis-file'
import { AvatarReferenceEntity } from './entities/vrchat-cache-avatar-reference'
import { APP_DATABASE_DIR } from '@main/constants'

import {
  CreateCredentialsTable1710000000000,
  CreateGroupsTable1710000000000,
  CreateSettingTable1710000000000,
  CreateWorldsTable1710000000000,
  CreateUsersTable1710000000000,
  CreateNotificationTable1710000000000,
  CreateImageSelectionTable1710000000000,
  CreateAnalysisFilesTable1720000000000,
  CreateVisitedInstanceTable1710000000000,
  CreateVisitedInstanceUserEventsTable1710000000001,
  CreateVisitedInstanceCommonEventsTable1710000000002,
  CreateAvatarReferencesTable1710000000000
} from './migration'

const STORAGE_DATABASE_NAME = 'storage.db'

export class Database extends Module {
  private readonly path = join(APP_DATABASE_DIR, STORAGE_DATABASE_NAME)
  private readonly logger = new DatabaseLogger(this.moduleId)
  private _source!: DataSource

  protected async onInit(): Promise<void> {
    const source = new DataSource({
      type: 'sqlite',
      database: this.path,
      logger: this.logger,
      entities: [
        CredentialEntity,
        GroupEntity,
        SettingEntity,
        WorldEntity,
        UserEntity,
        VisitedInstanceEntity,
        VisitedInstanceCommonEventEntity,
        VisitedInstanceUserEventEntity,
        NotificationEntity,
        ImageSelectionEntity,
        FileAnalysisEntity,
        AvatarReferenceEntity
      ],
      migrationsRun: true,
      migrations: [
        CreateCredentialsTable1710000000000,
        CreateSettingTable1710000000000,
        CreateWorldsTable1710000000000,
        CreateGroupsTable1710000000000,
        CreateUsersTable1710000000000,
        CreateNotificationTable1710000000000,
        CreateImageSelectionTable1710000000000,
        CreateAnalysisFilesTable1720000000000,
        CreateVisitedInstanceTable1710000000000,
        CreateVisitedInstanceUserEventsTable1710000000001,
        CreateVisitedInstanceCommonEventsTable1710000000002,
        CreateAvatarReferencesTable1710000000000
      ]
    })

    await source.initialize()
    // await source.synchronize()
    this._source = source
  }

  protected async onDestroy(): Promise<void> {
    await this._source.destroy()
  }

  public get source(): DataSource {
    return this._source
  }
}

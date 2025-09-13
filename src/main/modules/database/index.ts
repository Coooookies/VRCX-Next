import { DataSource } from 'typeorm'
import { join } from 'node:path'
import { Module } from '@shared/module-constructor'
import { DatabaseLogger } from './logger'
import { CredentialEntity } from './entities/credential'
import { WorldEntity } from './entities/world'
import { GroupEntity } from './entities/group'
import { SettingEntity } from './entities/setting'
import { UserEntity } from './entities/users'
import { NotificationEntity } from './entities/notifications'
import { ImageSelectionEntity } from './entities/selection-images'
import { FileAnalysisEntity } from './entities/analysis-files'
import { APP_DATABASE_DIR } from '@main/constants'

import {
  CreateCredentialsTable1710000000000,
  CreateGroupsTable1710000000000,
  CreateSettingTable1710000000000,
  CreateWorldsTable1710000000000,
  CreateUsersTable1710000000000,
  CreateNotificationTable1710000000000,
  CreateImageSelectionTable1710000000000,
  CreateAnalysisFilesTable1720000000000
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
        SettingEntity,
        WorldEntity,
        GroupEntity,
        UserEntity,
        NotificationEntity,
        ImageSelectionEntity,
        FileAnalysisEntity
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
        CreateAnalysisFilesTable1720000000000
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

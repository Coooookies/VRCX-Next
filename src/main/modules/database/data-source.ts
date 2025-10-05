import { join } from 'node:path'
import { DataSource } from 'typeorm'
import { CredentialEntity } from './entities/vrchat-credential'
import { WorldEntity } from './entities/vrchat-cache-world'
import { GroupEntity } from './entities/vrchat-cache-group'
import { SettingEntity } from './entities/setting'
import { UserEntity } from './entities/vrchat-cache-users'
import { NotificationEntity } from './entities/vrchat-notifications'
import { ImageSelectionEntity } from './entities/selection-images'
import { FileAnalysisEntity } from './entities/vrchat-cache-analysis-file'
import { AvatarReferenceEntity } from './entities/vrchat-cache-avatar-reference'
import {
  VisitedInstanceEntity,
  VisitedInstanceCommonEventEntity,
  VisitedInstanceUserEventEntity
} from './entities/vrchat-visited-instance'
import { APP_DATABASE_DIR } from '../../constants'

const STORAGE_DATABASE_PRODUCTION_PATH = join(APP_DATABASE_DIR, 'storage.db')
const STORAGE_DATABASE_MIGRATION_PATH = join(APP_DATABASE_DIR, 'swmigration.db')

const isCLI = process.env.TYPEORM_CLI === 'true'
const dbPath = isCLI ? STORAGE_DATABASE_MIGRATION_PATH : STORAGE_DATABASE_PRODUCTION_PATH

export default new DataSource({
  type: 'better-sqlite3',
  database: dbPath,
  synchronize: true,
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
  migrations: [],
  migrationsTableName: 'migrations',
  extra: {
    foreignKeys: true
  }
})

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
import {
  FriendAvatarActivityEntity,
  FriendCommonActivityEntity,
  FriendLocationActivityEntity
} from './entities/vrchat-friend-activity'
import { APP_DATABASE_DIR, IS_TYPEORM_CLI } from '@main/constants'
import { DBLogger } from './logger'

// Migrations
import { Auto1759666278579 } from './migrations/1759666278579-auto'
import { Auto1759774248112 } from './migrations/1759774248112-auto'
import type { Database } from 'better-sqlite3'

const STORAGE_DATABASE_PRODUCTION_PATH = join(APP_DATABASE_DIR, 'storage.db')
const STORAGE_DATABASE_MIGRATION_PATH = join(APP_DATABASE_DIR, 'swmigration.db')

const dbPath = IS_TYPEORM_CLI ? STORAGE_DATABASE_MIGRATION_PATH : STORAGE_DATABASE_PRODUCTION_PATH
const logger = new DBLogger('Database')

export default new DataSource({
  type: IS_TYPEORM_CLI ? 'sqlite' : 'better-sqlite3',
  logger,
  database: dbPath,
  synchronize: false,
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
    AvatarReferenceEntity,
    FriendLocationActivityEntity,
    FriendAvatarActivityEntity,
    FriendCommonActivityEntity
  ],
  migrations: [Auto1759666278579, Auto1759774248112],
  migrationsTableName: 'migrations',
  prepareDatabase(db: Database) {
    db.pragma('foreign_keys = ON')
  }
})

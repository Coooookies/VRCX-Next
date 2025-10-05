import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { env } from 'node:process'
import { app } from 'electron'

export const TEMP_DIR = tmpdir()
export const IS_TYPEORM_CLI = process.env.TYPEORM_CLI === 'true'

export const APP_ID = 'com.mitay.vrcx-next'
export const APP_NAME = IS_TYPEORM_CLI ? APP_ID : app.getName()
export const APP_PROTOCOL = 'vrcxnext'
export const APP_ENCODING = 'utf-8'
export const APP_VERSION = IS_TYPEORM_CLI ? '0.0.0' : app.getVersion()

export const APP_ENV =
  env.NODE_ENV === 'development' || IS_TYPEORM_CLI ? 'development' : 'production'

export const APP_SAVED_DIR = IS_TYPEORM_CLI ? TEMP_DIR : app.getPath('userData')
export const APP_RUN_DIR = IS_TYPEORM_CLI ? TEMP_DIR : app.getPath('exe')

export const APP_LOG_DIR = join(APP_SAVED_DIR, APP_ENV === 'development' ? 'logs/dev' : 'logs')
export const APP_DATABASE_DIR = join(APP_SAVED_DIR, 'databases')
export const APP_CACHE_DIR = join(APP_SAVED_DIR, 'caches')

export const APP_SERVER_PORT = 49006
export const APP_SERVER_HOSTNAME = '0.0.0.0'

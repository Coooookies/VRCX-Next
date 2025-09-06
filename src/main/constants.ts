import { join } from 'node:path'
import { env } from 'node:process'
import { is } from '@electron-toolkit/utils'
import { app } from 'electron'

export const APP_NAME = app.getName()
export const APP_ID = 'com.mitay.vrcx-next'
export const APP_PROTOCOL = 'vrcxnext'
export const APP_ENCODING = 'utf-8'
export const APP_VERSION = app.getVersion()

export const APP_ENV = env.NODE_ENV === 'development' ? 'development' : 'production'
export const APP_SAVED_DIR = app.getPath('userData')
export const APP_RUN_DIR = app.getPath('exe')

export const APP_LOG_DIR = join(APP_SAVED_DIR, APP_ENV === 'development' ? 'logs/dev' : 'logs')
export const APP_DATABASE_DIR = join(APP_SAVED_DIR, 'databases')
export const APP_CACHE_DIR = join(APP_SAVED_DIR, 'caches')

export const APP_SERVER_PORT = 49006
export const APP_SERVER_HOSTNAME = '0.0.0.0'

export const RENDERER_IS_DEV_ENV = is.dev && process.env['ELECTRON_RENDERER_URL']
export const RENDERER_ENTRY_PRELOAD = join(__dirname, '../preload/index.js')

export const RENDERER_ENTRY_DEV = (name: string): string =>
  `${process.env['ELECTRON_RENDERER_URL']}/${name}.html`

export const RENDERER_ENTRY_PRODUCTION = (name: string): string =>
  join(__dirname, `../renderer/${name}.html`)

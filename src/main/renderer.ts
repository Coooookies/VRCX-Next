import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'

export const RENDERER_IS_DEV_ENV = is.dev && process.env['ELECTRON_RENDERER_URL']
export const RENDERER_ENTRY_PRELOAD = join(__dirname, '../preload/index.js')

export const RENDERER_ENTRY_DEV = (name: string): string =>
  `${process.env['ELECTRON_RENDERER_URL']}/${name}.html`

export const RENDERER_ENTRY_PRODUCTION = (name: string): string =>
  join(__dirname, `../renderer/${name}.html`)

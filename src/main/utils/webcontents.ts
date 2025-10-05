import { LoggerFactory } from '@main/logger'
import { BrowserWindow, shell } from 'electron'
import { RENDERER_ENTRY_DEV, RENDERER_ENTRY_PRODUCTION, RENDERER_IS_DEV_ENV } from '@main/renderer'

export function registerWebviewConsoloLogger(win: BrowserWindow, logger: LoggerFactory): void {
  win.webContents.on('console-message', ({ level, message }) => {
    switch (level) {
      case 'error':
        logger.error(`[Renderer console]`, message)
        break
      case 'warning':
        logger.warn(`[Renderer console]`, message)
        break
      case 'debug':
        logger.debug(`[Renderer console]`, message)
        break
      case 'info':
      default:
        logger.info(`[Renderer console]`, message)
    }
  })
}

export function registerWebviewEssential(win: BrowserWindow): void {
  win.webContents.setZoomFactor(1)
  win.webContents.setVisualZoomLevelLimits(1, 1)
  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
}

export function registerWebviewEntry(
  win: BrowserWindow,
  pageName: string,
  option: {
    hash?: string
    query?: Record<string, string>
  } = {}
): void {
  if (RENDERER_IS_DEV_ENV) {
    const orginalQuery = Object.entries(option.query || {})
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')

    const hash = option.hash ? '#' + option.hash : ''
    const query = option.query && Object.keys(option.query).length ? '?' + orginalQuery : ''
    const url = RENDERER_ENTRY_DEV(pageName) + hash + query

    win.loadURL(url)
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(RENDERER_ENTRY_PRODUCTION(pageName), {
      hash: option.hash,
      query: option.query
    })
  }
}

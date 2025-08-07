import { join } from 'node:path'
import { uptime } from 'node:os'
import { mkdirSync, existsSync, createWriteStream } from 'node:fs'
import { hashStringToNumber } from '@shared/utils/string'
import { mixed } from '@shared/logger/color'
import { Logger } from '@shared/logger'
import { ConsoleStyle } from '@shared/logger/constants'
import { APP_ENV, APP_LOG_DIR } from '@main/constants'
import type { MixedStyle } from '@shared/logger/color'

const presetModuleNamespaceColor: ConsoleStyle[] = [
  // ConsoleStyle.FG_RED,
  ConsoleStyle.FG_GREEN,
  ConsoleStyle.FG_YELLOW,
  ConsoleStyle.FG_BLUE,
  ConsoleStyle.FG_MAGENTA,
  ConsoleStyle.FG_CYAN,
  // ConsoleStyle.FG_BRIGHT_RED,
  ConsoleStyle.FG_BRIGHT_GREEN,
  ConsoleStyle.FG_BRIGHT_YELLOW,
  ConsoleStyle.FG_BRIGHT_BLUE,
  ConsoleStyle.FG_BRIGHT_MAGENTA,
  ConsoleStyle.FG_BRIGHT_CYAN
]

const date = new Date()
const logFileName = `${date.toISOString().replace(/[:.]/g, '-')}.${uptime() * 1000}.log`
const logFilePath = join(APP_LOG_DIR, logFileName)

if (!existsSync(APP_LOG_DIR)) {
  mkdirSync(APP_LOG_DIR, { recursive: true })
}

const logger = new Logger(APP_ENV)
const logStream = createWriteStream(logFilePath, { flags: 'a' })

logger.on('log', (level, _, __, line) => {
  switch (level) {
    case 'error':
    case 'fatal':
    case 'info':
    case 'warn': {
      logStream.write(line + '\n')
      break
    }

    case 'debug':
    case 'trace': {
      if (APP_ENV === 'development') logStream.write(line + '\n')
      break
    }
  }
})

export class LoggerFactory {
  private namespace: MixedStyle

  constructor(namespace: string) {
    const index = hashStringToNumber(namespace)
    const color = presetModuleNamespaceColor[index % presetModuleNamespaceColor.length]
    this.namespace = mixed(color, namespace)
  }

  public fatal(...args: unknown[]): void {
    return logger.fatal(this.namespace, '>', ...args)
  }

  public error(...args: unknown[]): void {
    return logger.error(this.namespace, '>', ...args)
  }

  public warn(...args: unknown[]): void {
    return logger.warn(this.namespace, '>', ...args)
  }

  public info(...args: unknown[]): void {
    return logger.info(this.namespace, '>', ...args)
  }

  public debug(...args: unknown[]): void {
    return logger.debug(this.namespace, '>', ...args)
  }

  public trace(...args: unknown[]): void {
    return logger.trace(this.namespace, '>', ...args)
  }
}

export { logger }
export function createLogger(namespace: string): LoggerFactory {
  return new LoggerFactory(namespace)
}

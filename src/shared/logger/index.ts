import Nanobus from 'nanobus'
import { ConsoleStyle, LoglevelColor } from './constants'
import { MixedStyle, mixed } from './color'
import type { LogLevel } from './types'

export class Logger extends Nanobus<{
  log: (level: LogLevel, timestamp: number, message: string, line: string) => void
}> {
  private readonly env: string
  private latestLogTime = 0

  constructor(env: string = 'development') {
    super('logger')
    this.env = env
  }

  public fatal(...args: unknown[]): void {
    this.log('fatal', args)
  }

  public error(...args: unknown[]): void {
    this.log('error', args)
  }

  public warn(...args: unknown[]): void {
    this.log('warn', args)
  }

  public info(...args: unknown[]): void {
    this.log('info', args)
  }

  public debug(...args: unknown[]): void {
    this.log('debug', args)
  }

  public trace(...args: unknown[]): void {
    this.log('trace', args)
  }

  private log(level: LogLevel, args: (unknown | MixedStyle)[]): void {
    const levelSymbol = level.toUpperCase().slice(0, 1)
    const levelColor = LoglevelColor[level]

    const time = this.time
    const timestamp = this.timestamp

    const prefix = [
      mixed(ConsoleStyle.FG_BRIGHT_BLACK, time),
      mixed(levelColor, `-${levelSymbol}-`)
    ]
    const suffix = [
      mixed(
        ConsoleStyle.FG_BRIGHT_BLACK,
        this.latestLogTime > 0 ? `+${timestamp - this.latestLogTime}ms` : ''
      )
    ]

    const message = [...prefix, ...args, ...suffix]
    const raw = message.map((arg) => (arg instanceof MixedStyle ? arg.raw : `${arg}`)).join(' ')
    const t = message.map((arg) => (arg instanceof MixedStyle ? arg.t : `${arg}`)).join(' ')

    switch (level) {
      case 'fatal':
      case 'error':
        console.error(t)
        break
      case 'warn':
        console.warn(t)
        break
      case 'info':
        console.info(t)
        break
      case 'debug':
        if (this.env === 'development') console.debug(t)
        break
      case 'trace':
        if (this.env === 'development') console.log(t)
        break
    }

    this.latestLogTime = timestamp
    this.emit('log', level, timestamp, t, raw)
  }

  private get time(): string {
    const now = new Date()

    const pad = (num, size = 2): string => String(num).padStart(size, '0')
    const hours = pad(now.getHours())
    const minutes = pad(now.getMinutes())
    const seconds = pad(now.getSeconds())
    const milliseconds = pad(now.getMilliseconds(), 3)

    return `${hours}:${minutes}:${seconds}.${milliseconds}`
  }

  private get timestamp(): number {
    return Date.now()
  }
}

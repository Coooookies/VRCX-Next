// https://github.com/LunyaaDev/vrchat-log-watcher/blob/main/src/index.ts

import { existsSync, watch } from 'fs'
import { createLogger } from '@main/logger'
import { readLinesReverse, ReverseReadStopSignal } from '@main/utils/fs'
import { parseEventLine, parseSpecialEventLine } from './log-parser'
import { getLatestLogfile, getLogDir, isLogFile } from './utils'
import { Tail } from 'tail'
import { Dependency, Module } from '@shared/module-constructor'
import {
  GAMELOG_PARSER_DATE_REGEXP,
  GAMELOG_PARSER_REGEXP,
  GAMELOG_PROCESS_USER_EVENTS_LIMIT
} from './constants'
import { LogEvents } from './types'
import { ServiceMonitor } from '../service-monitor'
import type { GameProcessUser, LogEventContext, LogEventMessage, LogEventSummary } from './types'

export class VRChatGameProcess extends Module<{
  'log:raw': (raw: string) => void
  'game:start': () => void
  'game:stop': () => void
  'game:event': (data: LogEventMessage, context: LogEventContext) => void
  'game:user-authenticated': (userId: string, userName: string) => void
  'game:user-logged-out': (exitWithGame: boolean) => void
}> {
  @Dependency('ServiceMonitor') declare private monitor: ServiceMonitor

  private readonly logger = createLogger(this.moduleId)
  public static lineRegex = GAMELOG_PARSER_REGEXP
  public static lineDataRegex = GAMELOG_PARSER_DATE_REGEXP

  private currentLogDir: string = getLogDir()
  private currentLogFile: null | string = null
  private tail: null | Tail = null
  private user: GameProcessUser | null = null

  protected onInit(): void {
    this.bindEvents()
  }

  protected onLoad(): void {
    this.startWatchFile()

    if (this.monitor.vrchatState.isRunning) {
      this.resumeCurrentGameUser()
    }
  }

  private bindEvents() {
    this.on('log:raw', (raw) => {
      this.logger.trace('Raw log line:', raw)
    })

    this.on('game:event', (event) => {
      switch (event.type) {
        case LogEvents.UserAuthenticated: {
          this.setCurrentGameUser(event.content)
          break
        }
        case LogEvents.UserLoggedOut: {
          this.clearCurrentGameUser(false)
          break
        }
      }

      this.logger.debug('Parsed log event:', event.type, JSON.stringify(event.content, null, 2))
    })

    this.monitor.on('process:vrchat:state-change', (isRunning) => {
      if (isRunning) {
        this.resumeCurrentGameUser()
        this.emit('game:start')
      } else {
        this.clearCurrentGameUser(true)
        this.emit('game:stop')
      }
    })
  }

  private startWatchFile() {
    if (!existsSync(this.currentLogDir)) {
      return
    }

    this.currentLogFile = getLatestLogfile(this.currentLogDir)
    this.watchFile()

    watch(this.currentLogDir, (event, filename) => {
      if (!filename || event !== 'rename') {
        return
      }

      if (!isLogFile(filename)) {
        return
      }

      const newLogFile = getLatestLogfile(this.currentLogDir)
      if (newLogFile === this.currentLogFile) {
        return
      }

      this.currentLogFile = newLogFile
      this.watchFile()
    })
  }

  private watchFile = () => {
    if (this.tail) {
      this.tail.unwatch()
      this.tail = null
    }

    if (!this.currentLogFile) {
      return
    }

    this.logger.info('Watching log file:', this.currentLogFile)
    this.tail = new Tail(this.currentLogFile, {
      useWatchFile: true,
      fromBeginning: false,
      fsWatchOptions: {
        interval: 1000
      }
    })
    this.tail.on('line', (data) => this.handleParseLine(data))
    this.tail.on('error', (error) => {
      this.logger.error('Tail error:', error)
      this.tail?.unwatch()
    })
  }

  private handleParseLine(data: string) {
    this.emit('log:raw', data)

    const context = parseEventLine(data)
    if (!context) {
      return
    }

    const specialEvent = parseSpecialEventLine(context)
    if (specialEvent) {
      this.emit('game:event', specialEvent, context)
    }
  }

  private setCurrentGameUser(user: GameProcessUser) {
    this.user = user
    this.emit('game:user-authenticated', user.userId, user.userName)
  }

  private clearCurrentGameUser(exitWithGame: boolean) {
    this.user = null
    this.emit('game:user-logged-out', exitWithGame)
  }

  private async resumeCurrentGameUser() {
    const events = await this.resolveBackwardEvents(
      GAMELOG_PROCESS_USER_EVENTS_LIMIT,
      (data, _, signal) => {
        switch (data.type) {
          case LogEvents.UserAuthenticated:
          case LogEvents.UserLoggedOut: {
            signal.stop(true)
            break
          }
        }

        return false
      }
    )

    if (events.length === 0) {
      return
    }

    const event = events[0]
    switch (event.data.type) {
      case LogEvents.UserAuthenticated: {
        this.setCurrentGameUser(event.data.content)
        break
      }
      case LogEvents.UserLoggedOut: {
        this.clearCurrentGameUser(false)
        break
      }
    }
  }

  public async resolveBackwardEvents(
    maxLines = 1500,
    filter: (
      data: LogEventMessage,
      context: LogEventContext,
      signal: ReverseReadStopSignal
    ) => boolean = () => true
  ): Promise<LogEventSummary[]> {
    if (!this.currentLogFile) {
      return []
    }

    const lines = await readLinesReverse(this.currentLogFile, {
      maxLines,
      filter: (line, signal) => {
        const context = parseEventLine(line)
        if (!context) {
          return false
        }

        const data = parseSpecialEventLine(context)
        if (data) {
          return filter(data, context, signal)
        }

        return false
      }
    })

    return lines.map((line) => {
      const context = parseEventLine(line)!
      const data = parseSpecialEventLine(context)!
      return { context, data }
    })
  }

  public get currentUser() {
    return this.user
  }
}

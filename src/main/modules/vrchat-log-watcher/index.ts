// https://github.com/LunyaaDev/vrchat-log-watcher/blob/main/src/index.ts

import { existsSync, watch } from 'fs'
import { createLogger } from '@main/logger'
import { readLinesReverse, ReverseReadStopSignal } from '@main/utils/fs'
import { parseEventLine, parseSpecialEventLine } from './log-parser'
import { getLatestLogfile, getLogDir, isLogFile } from './utils'
import { Tail } from 'tail'
import { Module } from '@shared/module-constructor'
import { GAMELOG_PARSER_DATE_REGEXP, GAMELOG_PARSER_REGEXP } from './constants'
import type { LogEventContext, LogEventMessage, LogEventSummary } from './types'

export class VRChatLogWatcher extends Module<{
  raw: (raw: string) => void
  message: (data: LogEventMessage, context: LogEventContext) => void
}> {
  private readonly logger = createLogger(this.moduleId)
  public static lineRegex = GAMELOG_PARSER_REGEXP
  public static lineDataRegex = GAMELOG_PARSER_DATE_REGEXP

  private currentLogDir: string = getLogDir()
  private currentLogFile: null | string = null
  private tail: null | Tail = null

  protected onInit(): void {
    this.startWatchFile()
    this.bindEvents()
  }

  private bindEvents() {
    this.on('raw', (data) => {
      this.logger.debug('Raw log line:', data)
    })

    this.on('message', (data) => {
      this.logger.debug('Parsed log event:', data.type, JSON.stringify(data.content, null, 2))
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
    this.emit('raw', data)

    const context = parseEventLine(data)
    if (!context) {
      return
    }

    const specialEvent = parseSpecialEventLine(context)
    if (specialEvent) {
      this.emit('message', specialEvent, context)
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
}

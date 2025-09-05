// https://github.com/LunyaaDev/vrchat-log-watcher/blob/main/src/index.ts

import { watch } from 'fs'
import { createLogger } from '@main/logger'
import { parseEventLine, parseSpecialEventLine } from './log-parser'
import { getLatestLogfile, getLogDir, isLogFile } from './utils'
import { Tail } from 'tail'
import { Module } from '@shared/module-constructor'
import { GAMELOG_PARSER_DATE_REGEXP, GAMELOG_PARSER_REGEXP } from './constants'
import type { LogEventContext, LogEventMessage } from './types'

export class VRChatLogWatcher extends Module<{
  raw: (raw: string) => void
  message: (data: LogEventMessage, context: LogEventContext) => void
}> {
  private readonly logger = createLogger(this.moduleId)
  public static lineRegex = GAMELOG_PARSER_REGEXP
  public static lineDataRegex = GAMELOG_PARSER_DATE_REGEXP

  private vrchatLogDir: string = getLogDir()
  private currentLogFile: null | string = null
  private tail: null | Tail = null

  protected onInit(): void {
    this.currentLogFile = getLatestLogfile(this.vrchatLogDir)
    this.startWatchFile()
    this.bindEvents()
  }

  private bindEvents() {
    // this.on('raw', (data) => {
    //   this.logger.trace('Raw log line:', data)
    // })

    this.on('message', (context, data) => {
      this.logger.trace(
        'Parsed log event:',
        JSON.stringify(context, null, 2),
        JSON.stringify(data, null, 2)
      )
    })
  }

  private startWatchFile() {
    this.watchFile()
    watch(this.vrchatLogDir, (event, filename) => {
      if (!filename || event !== 'rename') {
        return
      }

      if (!isLogFile(filename)) {
        return
      }

      const newLogFile = getLatestLogfile(this.vrchatLogDir)
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

    this.tail = new Tail(this.currentLogFile, { fromBeginning: false })
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
}

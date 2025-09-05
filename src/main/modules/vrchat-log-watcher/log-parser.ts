import {
  GAMELOG_IMAGE_OR_STRING_LOAD_REGEXP,
  GAMELOG_PARSER_DATE_REGEXP,
  GAMELOG_PARSER_REGEXP,
  GAMELOG_PLAYER_ACTIVITY_REGEXP
} from './constants'
import { LogEvents } from './types'
import type { LogEventContext, LogEventMessage } from './types'

export function parseEventLine(line: string): LogEventContext | null {
  const regexResLine = line.match(GAMELOG_PARSER_REGEXP)

  if (
    !regexResLine ||
    !regexResLine.groups ||
    !regexResLine.groups.date ||
    !regexResLine.groups.type ||
    !regexResLine.groups.data
  ) {
    return null
  }

  const type = <LogEventContext['type']>regexResLine.groups.type.toLocaleLowerCase()
  const date = new Date(regexResLine.groups.date)
  const data: LogEventContext = {
    type,
    date,
    data: regexResLine.groups.data.trim()
  }

  const regexResMsg = data.data.match(GAMELOG_PARSER_DATE_REGEXP)
  if (regexResMsg && regexResMsg.groups && regexResMsg.groups.topic && regexResMsg.groups.content) {
    data.topic = regexResMsg.groups.topic
    data.content = regexResMsg.groups.content
  }

  return data
}

export function parseSpecialEventLine(data: LogEventContext): LogEventMessage | null {
  // String Download / Image Download
  if (data.type == 'debug' && (data.topic == 'String Download' || data.topic == 'Image Download')) {
    const regexRes = data.content?.match(GAMELOG_IMAGE_OR_STRING_LOAD_REGEXP)

    // if url found emit event
    if (regexRes && regexRes.groups && regexRes.groups.url) {
      return {
        type: data.topic == 'String Download' ? LogEvents.StringLoad : LogEvents.ImageLoad,
        content: {
          url: regexRes.groups.url
        }
      }
    }
  }

  // world join
  if (
    data.type == 'debug' &&
    data.topic == 'Behaviour' &&
    data.content?.startsWith('Joining wrld_')
  ) {
    return {
      type: LogEvents.SelfJoin,
      content: {
        location: data.content.substring('Joining '.length)
      }
    }
  }

  // world leave
  if (data.type == 'debug' && data.topic == 'Behaviour' && data.content == 'Unloading scenes') {
    return {
      type: LogEvents.SelfLeave,
      content: null
    }
  }

  // player join / leave
  if (
    data.type == 'debug' &&
    data.topic == 'Behaviour' &&
    (data.content?.startsWith('OnPlayerJoined ') || data.content?.startsWith('OnPlayerLeft '))
  ) {
    const regexRes = data.content.match(GAMELOG_PLAYER_ACTIVITY_REGEXP)

    if (regexRes?.groups?.username) {
      return {
        type: data.content.startsWith('OnPlayerJoined ')
          ? LogEvents.PlayerJoined
          : LogEvents.PlayerLeft,
        content: {
          userName: regexRes.groups.username,
          userId: regexRes.groups.userId || undefined
        }
      }
    }
  }

  return null
}

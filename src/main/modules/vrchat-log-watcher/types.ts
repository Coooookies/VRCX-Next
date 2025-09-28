export interface LogEventContext {
  type: 'debug' | 'warning' | 'error'
  data: string
  date: Date
  topic?: string
  content?: string
}

export interface LogEventUrlLoad {
  url: string
}

export interface LogEventVideoLoad {
  url: string
}

export interface LogEventVideoError {
  reason: string
}

export interface LogEventSelfJoin {
  location: string
}

export interface LogEventVoteKick {
  userName: string
}

export interface LogEventPlayerActivity {
  userId?: string
  userName: string
}

export interface LogEventPrepartion {
  state: string
  seconds: number
  progress: number
}

export const LogEvents = {
  SelfJoin: 'selfJoin',
  SelfLeave: 'selfLeave',
  PlayerJoined: 'playerJoined',
  PlayerLeft: 'playerLeft',
  Prepartion: 'prepartion',
  VoteKick: 'voteKick',
  StringLoad: 'stringLoad',
  ImageLoad: 'imageLoad',
  VideoPlaybackLoad: 'VideoPlaybackLoad',
  VideoPlaybackError: 'VideoPlaybackError'
} as const

export type LogEvents = (typeof LogEvents)[keyof typeof LogEvents]

export type LogEventDefinition = {
  [LogEvents.SelfJoin]: LogEventSelfJoin
  [LogEvents.SelfLeave]: null
  [LogEvents.PlayerJoined]: LogEventPlayerActivity
  [LogEvents.PlayerLeft]: LogEventPlayerActivity
  [LogEvents.Prepartion]: LogEventPrepartion
  [LogEvents.VoteKick]: LogEventVoteKick
  [LogEvents.StringLoad]: LogEventUrlLoad
  [LogEvents.ImageLoad]: LogEventUrlLoad
  [LogEvents.VideoPlaybackLoad]: LogEventVideoLoad
  [LogEvents.VideoPlaybackError]: LogEventVideoError
}

export type LogEventMessage = {
  [K in LogEvents]: {
    type: K
    content: LogEventDefinition[K]
  }
}[LogEvents]

export interface LogEventSummary {
  data: LogEventMessage
  context: LogEventContext
}

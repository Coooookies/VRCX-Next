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

export interface LogEventSelfJoin {
  location: string
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
  StringLoad: 'stringLoad',
  ImageLoad: 'imageLoad',
  SelfJoin: 'selfJoin',
  SelfLeave: 'selfLeave',
  PlayerJoined: 'playerJoined',
  PlayerLeft: 'playerLeft',
  Prepartion: 'prepartion'
} as const

export type LogEvents = (typeof LogEvents)[keyof typeof LogEvents]

export type LogEventDefinition = {
  [LogEvents.StringLoad]: LogEventUrlLoad
  [LogEvents.ImageLoad]: LogEventUrlLoad
  [LogEvents.SelfJoin]: LogEventSelfJoin
  [LogEvents.SelfLeave]: null
  [LogEvents.PlayerJoined]: LogEventPlayerActivity
  [LogEvents.PlayerLeft]: LogEventPlayerActivity
  [LogEvents.Prepartion]: LogEventPrepartion
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

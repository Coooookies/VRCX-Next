export interface ProcessInfo {
  pid: number
  cmd: string
}

export type ProcessState =
  | {
      running: true
      processInfo: ProcessInfo
    }
  | {
      running: false
    }

export interface ProcessTracker {
  running: boolean
  processInfo: ProcessInfo | null
  pattern: RegExp
  eventName: 'process:vrchat:state-change' | 'process:steamvr:state-change'
  displayName: string
}

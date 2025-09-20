export const PROCESS_MONITOR_TIMER_INTERVAL = 3_000
export const PROCESS_VRCHAT_PATTERN = /^vrchat(\.exe)?$/i
export const PROCESS_STEAMVR_PATTERN = /^vrserver(\.exe)?$/i

export const PROCESS_PATTERNS = {
  vrchat: PROCESS_VRCHAT_PATTERN,
  steamvr: PROCESS_STEAMVR_PATTERN
} as const

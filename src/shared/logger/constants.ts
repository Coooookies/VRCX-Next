import { LogLevel } from './types'

export enum ConsoleStyle {
  // Foreground colors
  FG_BLACK = '\x1b[30m',
  FG_RED = '\x1b[31m',
  FG_GREEN = '\x1b[32m',
  FG_YELLOW = '\x1b[33m',
  FG_BLUE = '\x1b[34m',
  FG_MAGENTA = '\x1b[35m',
  FG_CYAN = '\x1b[36m',
  FG_WHITE = '\x1b[37m',
  FG_BRIGHT_BLACK = '\x1b[90m',
  FG_BRIGHT_RED = '\x1b[91m',
  FG_BRIGHT_GREEN = '\x1b[92m',
  FG_BRIGHT_YELLOW = '\x1b[93m',
  FG_BRIGHT_BLUE = '\x1b[94m',
  FG_BRIGHT_MAGENTA = '\x1b[95m',
  FG_BRIGHT_CYAN = '\x1b[96m',
  FG_BRIGHT_WHITE = '\x1b[97m',

  // Background colors
  BG_BLACK = '\x1b[40m',
  BG_RED = '\x1b[41m',
  BG_GREEN = '\x1b[42m',
  BG_YELLOW = '\x1b[43m',
  BG_BLUE = '\x1b[44m',
  BG_MAGENTA = '\x1b[45m',
  BG_CYAN = '\x1b[46m',
  BG_WHITE = '\x1b[47m',
  BG_BRIGHT_BLACK = '\x1b[100m',
  BG_BRIGHT_RED = '\x1b[101m',
  BG_BRIGHT_GREEN = '\x1b[102m',
  BG_BRIGHT_YELLOW = '\x1b[103m',
  BG_BRIGHT_BLUE = '\x1b[104m',
  BG_BRIGHT_MAGENTA = '\x1b[105m',
  BG_BRIGHT_CYAN = '\x1b[106m',
  BG_BRIGHT_WHITE = '\x1b[107m',

  // Text styles
  BOLD = '\x1b[1m',
  DIM = '\x1b[2m',
  ITALIC = '\x1b[3m',
  UNDERLINE = '\x1b[4m',
  INVERSE = '\x1b[7m',
  HIDDEN = '\x1b[8m',
  STRIKETHROUGH = '\x1b[9m',

  // Reset
  RESET = '\x1b[0m'
}

export const LoglevelColor: { [key in LogLevel]: ConsoleStyle } = {
  fatal: ConsoleStyle.BG_RED,
  error: ConsoleStyle.BG_RED,
  warn: ConsoleStyle.BG_YELLOW,
  info: ConsoleStyle.BG_GREEN,
  debug: ConsoleStyle.BG_BLUE,
  trace: ConsoleStyle.BG_CYAN
}

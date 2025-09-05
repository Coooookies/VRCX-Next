// https://github.com/LunyaaDev/vrchat-log-watcher/blob/main/src/utils/getLatestLogfile.ts
// https://github.com/LunyaaDev/vrchat-log-watcher/blob/main/src/utils/getVrchatLogDir.ts

import { homedir } from 'node:os'
import { join } from 'node:path'
import { readdirSync, statSync } from 'node:fs'

export function isLogFile(filename: string) {
  return filename.startsWith('output_log_')
}

export function getLatestLogfile(logDir: string) {
  const logFiles = readdirSync(logDir)
    .filter((x) => isLogFile(x))
    .map((x) => ({
      filename: x,
      createdAt: statSync(join(logDir, x)).ctime.getTime()
    }))
    .sort((a, b) => b.createdAt - a.createdAt)

  if (logFiles.length === 0) {
    return null
  }

  return join(logDir, logFiles[0].filename)
}

export function getLogDir() {
  switch (process.platform) {
    case 'win32': {
      // Windows version
      return join(homedir(), 'Appdata', 'LocalLow', 'VRChat', 'VRChat')
    }
    default: {
      return join(
        homedir(),
        '.steam',
        'steam',
        'steamapps',
        'compatdata',
        '438100',
        'pfx',
        'drive_c',
        'users',
        'steamuser',
        'AppData',
        'LocalLow',
        'VRChat',
        'VRChat'
      )
    }
  }
}

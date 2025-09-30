// https://github.com/LunyaaDev/vrchat-log-watcher/blob/main/src/utils/getLatestLogfile.ts
// https://github.com/LunyaaDev/vrchat-log-watcher/blob/main/src/utils/getVrchatLogDir.ts

import { homedir } from 'node:os'
import { join } from 'node:path'
import { readdirSync, statSync } from 'node:fs'
import { attempt } from '@shared/utils/async'

export function isLogFile(filename: string) {
  return filename.startsWith('output_log_')
}

export function getLatestLogfile(logDir: string) {
  const getStats = (path: string) => {
    const stats = statSync(join(logDir, path))
    return {
      filename: path,
      createdAt: stats.ctime.getTime()
    }
  }

  const { success, value: logFiles } = attempt(() =>
    readdirSync(logDir)
      .filter((x) => isLogFile(x))
      .map((x) => getStats(x))
      .sort((a, b) => b.createdAt - a.createdAt)
  )

  if (!success || logFiles.length === 0) {
    return null
  }

  return join(logDir, logFiles[0].filename)
}

export function getLogDir() {
  switch (process.platform) {
    case 'win32': {
      // Windows version
      return join(homedir(), 'Appdata/LocalLow/VRChat/VRChat')
    }
    default: {
      return join(
        homedir(),
        '.steam/steam/steamapps/compatdata/438100/pfx/drive_c/users/steamuser/AppData/LocalLow/VRChat/VRChat'
      )
    }
  }
}

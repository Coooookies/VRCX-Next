import childProcess from 'node:child_process'

export function execSync(command: string, arguments_?: string[]) {
  return childProcess
    .execFileSync(command, arguments_, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })
    .toString()
    .trim()
}

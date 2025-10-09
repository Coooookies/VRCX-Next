import { FileUrlParsedResult } from '@shared/definition/vrchat-files'

export function parseFileUrl(url: string): FileUrlParsedResult | null {
  const match = url.match(/(?<fileid>file_[0-9A-Za-z-]+)\/(?<version>\d+)/)
  if (!match) {
    return null
  }

  return {
    fileId: match.groups?.fileid || '',
    version: Number(match.groups?.version) || 0
  }
}

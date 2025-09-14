import { FileUrlParsedResult } from '@shared/definition/vrchat-files'

export function parseFileUrl(url: string): FileUrlParsedResult | null {
  const match = url.match(/(file_[0-9A-Za-z-]+)\/(\d+)/)
  if (!match) {
    return null
  }

  const [, fileId, versionStr] = match
  return {
    fileId,
    version: parseInt(versionStr, 10) || 1
  }
}

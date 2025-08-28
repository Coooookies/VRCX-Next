export function parseFileUrl(url: string): { fileId: string; version: number } {
  const match = url.match(/(file_[0-9A-Za-z-]+)\/(\d+)/)
  if (match) {
    const [, fileId, versionStr] = match
    return {
      fileId,
      version: parseInt(versionStr, 10) || 1
    }
  }
  return {
    fileId: '',
    version: 1
  }
}

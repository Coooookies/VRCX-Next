import type { CurrentUser, LimitedUserFriend } from '@shared/definition/vrchat-api-response'

export function getProfileIconUrl(target: CurrentUser | LimitedUserFriend): string {
  return (
    target.userIcon || target.currentAvatarThumbnailImageUrl || target.profilePicOverrideThumbnail
  )
}

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

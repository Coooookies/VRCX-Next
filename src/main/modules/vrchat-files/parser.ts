import type { CurrentUser, LimitedUserFriend, User } from '@shared/definition/vrchat-api-response'

export function getProfileIconUrl(target: User | CurrentUser | LimitedUserFriend): string {
  return (
    target.userIcon || target.currentAvatarThumbnailImageUrl || target.profilePicOverrideThumbnail
  )
}

export { parseFileUrl } from '@shared/utils/vrchat-url-parser'

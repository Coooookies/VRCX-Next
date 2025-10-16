import type { Platform, ReleaseStatus } from './vrchat-api-response'

export interface UserAvatar {
  imageFileId: string
  imageFileVersion: number
  referenceAvatarFile?: AvatarReferenceSummary
}

export interface CurrentUserAvatar {
  avatarId: string
  imageFileId: string
  imageFileVersion: number
}

export interface AvatarReferenceSummary {
  fileId: string
  fileName: string
  authorUserId: string
  avatarName?: string
  unityVersion?: string
  assetVersion?: number
  platform?: Platform
  releaseState?: string
  cacheUpdatedAt?: Date
}

export interface AvatarSummary {
  avatarId: string
  avatarName: string
  avatarVersion: number
  authorId: string
  authorName: string
  description: string
  imageFileId: string
  imageFileVersion: number
  releaseStatus: ReleaseStatus
}

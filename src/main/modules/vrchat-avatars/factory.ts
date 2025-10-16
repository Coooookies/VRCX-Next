import { parseFileUrl } from '@shared/utils/vrchat-url-parser'
import { AVATAR_REFERENCE_IMAGE_FILE_PATTERN_REGEXP } from './constants'
import type { AvatarReferenceEntity } from '../database/entities/vrchat-cache-avatar-reference'
import type { Avatar, ModelFile } from '@shared/definition/vrchat-api-response-community'
import type { Platform } from '@shared/definition/vrchat-api-response-replenish'
import type { AvatarSummary } from '@shared/definition/vrchat-avatars'

export function toAvatarReferenceEntity(data: ModelFile): AvatarReferenceEntity {
  const regexRes = data.name.match(AVATAR_REFERENCE_IMAGE_FILE_PATTERN_REGEXP)

  return {
    fileId: data.id,
    fileName: data.name,
    authorUserId: data.ownerId,
    avatarName: regexRes?.groups?.avatarname,
    unityVersion: regexRes?.groups?.unityversion,
    assetVersion: regexRes?.groups?.assetversion
      ? Number(regexRes?.groups?.assetversion)
      : undefined,
    platform: regexRes?.groups?.platform as Platform,
    releaseState: regexRes?.groups?.releasestate,
    cacheUpdatedAt: new Date()
  }
}

export function toAvatarEntity(avatar: Avatar): AvatarSummary {
  const imageFileInfo = parseFileUrl(avatar.imageUrl)

  return {
    avatarId: avatar.id,
    avatarName: avatar.name,
    avatarVersion: avatar.version,
    authorId: avatar.authorId,
    authorName: avatar.authorName,
    description: avatar.description,
    imageFileId: imageFileInfo?.fileId || '',
    imageFileVersion: imageFileInfo?.version || 0,
    releaseStatus: avatar.releaseStatus
  }
}

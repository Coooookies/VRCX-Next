import { AVATAR_REFERENCE_IMAGE_FILE_PATTERN_REGEXP } from './constants'
import type { AvatarReferenceEntity } from '../database/entities/vrchat-cache-avatar-reference'
import type { ModelFile } from '@shared/definition/vrchat-api-response-community'
import type { Platform } from '@shared/definition/vrchat-api-response-replenish'

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

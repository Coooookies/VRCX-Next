import { AvatarReferenceEntity } from '../database/entities/vrchat-cache-avatar-reference'
import type { ModelFile } from '@shared/definition/vrchat-api-response-community'

export function toAvatarReferenceEntity(data: ModelFile): AvatarReferenceEntity {
  return {
    fileId: data.id,
    avatarName: data.name,
    authorUserId: data.ownerId,
    cacheUpdatedAt: new Date()
  }
}

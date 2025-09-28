import { parseFileUrl } from '../vrchat-files/factory'
import { Group } from '@shared/definition/vrchat-api-response'
import type { GroupEntity } from '../database/entities/vrchat-cache-group'

export function toGroupEntity(group: Group): GroupEntity {
  const iconFileInfo = parseFileUrl(group.iconUrl || '')
  const bannerFileInfo = parseFileUrl(group.bannerUrl || '')

  return {
    groupId: group.id!,
    groupName: group.name!,
    shortCode: group.shortCode!,
    description: group.description!,
    iconFileId: iconFileInfo?.fileId || '',
    iconFileVersion: iconFileInfo?.version || 0,
    bannerFileId: bannerFileInfo?.fileId || '',
    bannerFileVersion: bannerFileInfo?.version || 0,
    ownerUserId: group.ownerId!,
    isVerified: group.isVerified!,
    cacheUpdatedAt: new Date()
  }
}

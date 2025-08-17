import { parseFileUrl } from '../vrchat-files/parser'
import { Group } from '@shared/definition/vrchat-api-response'
import type { GroupEntity } from '../database/entities/group'

export function toGroupEntity(group: Group): GroupEntity {
  const iconFileInfo = parseFileUrl(group.iconUrl || '')
  const bannerFileInfo = parseFileUrl(group.bannerUrl || '')

  return {
    groupId: group.id!,
    groupName: group.name!,
    shortCode: group.shortCode!,
    description: group.description!,
    iconFileId: iconFileInfo.fileId,
    iconFileVersion: iconFileInfo.version,
    bannerFileId: bannerFileInfo.fileId,
    bannerFileVersion: bannerFileInfo.version,
    ownerId: group.ownerId!,
    isVerified: group.isVerified!,
    cacheUpdatedAt: new Date()
  }
}

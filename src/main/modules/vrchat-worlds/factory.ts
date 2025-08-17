import { parseFileUrl } from '../vrchat-files/parser'
import { WorldEntity } from '../database/entities/world'
import { LocationInstance, LocationInstanceGroupType } from '@shared/definition/vrchat-instances'
import type { FavoritedWorld, World } from '@shared/definition/vrchat-api-response'

export function isGroupInstance(location: LocationInstance) {
  return (
    location.type === LocationInstanceGroupType.GroupPublic ||
    location.type === LocationInstanceGroupType.GroupPlus ||
    location.type === LocationInstanceGroupType.Group
  )
}

export function toWorldEntity(world: World | FavoritedWorld): WorldEntity {
  const imageFileInfo = parseFileUrl(world.imageUrl)

  return {
    worldId: world.id,
    worldName: world.name,
    authorId: world.authorId,
    authorName: world.authorName,
    description: world.description,
    imageFileId: imageFileInfo.fileId,
    imageFileVersion: imageFileInfo.version,
    organization: world.organization,
    releaseStatus: world.releaseStatus,
    updatedAt: new Date(world.updated_at),
    cacheUpdatedAt: new Date()
  }
}

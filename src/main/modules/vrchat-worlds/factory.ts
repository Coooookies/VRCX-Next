import { parseFileUrl } from '../vrchat-files/factory'
import { WorldEntity } from '../database/entities/world'
import type { FavoritedWorld, World } from '@shared/definition/vrchat-api-response'

export function toWorldEntity(world: World | FavoritedWorld): WorldEntity {
  const imageFileInfo = parseFileUrl(world.imageUrl)

  return {
    worldId: world.id,
    worldName: world.name,
    authorUserId: world.authorId,
    description: world.description,
    imageFileId: imageFileInfo.fileId,
    imageFileVersion: imageFileInfo.version,
    organization: world.organization,
    releaseStatus: world.releaseStatus,
    updatedAt: new Date(world.updated_at),
    cacheUpdatedAt: new Date()
  }
}

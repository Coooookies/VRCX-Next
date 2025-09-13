import { parseInstance } from './location-parser'
import { parseFileUrl } from '../vrchat-files/factory'
import { WorldEntity } from '../database/entities/world'
import type { FavoritedWorld, World } from '@shared/definition/vrchat-api-response'
import type { WorldDetail, WorldFavoriteState, WorldStats } from '@shared/definition/vrchat-worlds'
import { isGroupInstance } from './utils'
import { LocationInstanceGroup } from '@shared/definition/vrchat-instances'

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

export function toWorldDetail(world: World | FavoritedWorld): WorldDetail {
  const imageFileInfo = parseFileUrl(world.imageUrl)
  const worldStats: WorldStats = {
    favorites: world.favorites || 0,
    visits: world.visits || 0,
    heat: world.heat || 0,
    popularity: world.popularity || 0,
    totalOccupants: world.occupants || 0,
    publicOccupants: ('publicOccupants' in world && world.publicOccupants) || 0,
    privateOccupants: ('privateOccupants' in world && world.privateOccupants) || 0
  }

  const favoriteState: WorldFavoriteState =
    'favoriteId' in world
      ? {
          favorited: true,
          favoriteId: world.favoriteId,
          favoriteGroupName: world.favoriteGroup
        }
      : {
          favorited: false
        }

  return {
    worldId: world.id,
    worldName: world.name,
    authorUserId: world.authorId,
    authorUserName: world.authorName,
    description: world.description,
    imageFileId: imageFileInfo.fileId,
    imageFileVersion: imageFileInfo.version,
    organization: world.organization,
    tags: world.tags,
    releaseStatus: world.releaseStatus,
    favorite: favoriteState,
    instanceContentSettings: world.defaultContentSettings || {},
    instances: [], // manually fetch instances via fetcher
    packages: [], // manually fetch packages via fetcher
    stats: worldStats,
    labsPublicizedAt: new Date(world.labsPublicationDate),
    publicizedAt: new Date(world.publicationDate),
    updatedAt: new Date(world.updated_at),
    createdAt: new Date(world.created_at)
  }
}

export function toWorldDetailDependencys(world: World | FavoritedWorld) {
  const groupIds = new Set<string>()
  const assetUrls = new Set<string>()

  if ('instances' in world && world.instances) {
    for (const instance of world.instances) {
      const location = parseInstance(world.id, instance[0])
      if (location && isGroupInstance(location)) {
        const groupInstance = location as LocationInstanceGroup
        groupIds.add(groupInstance.groupId)
      }
    }
  }

  if (world.unityPackages) {
    for (const unityPackage of world.unityPackages) {
      if (unityPackage.assetUrl) {
        assetUrls.add(unityPackage.assetUrl)
      }
    }
  }

  return {
    groupIds: [...groupIds],
    assetUrls: [...assetUrls]
  }
}

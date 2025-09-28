import { isGroupInstance } from './utils'
import { parseInstance } from './location-parser'
import { parseFileUrl } from '../vrchat-files/factory'
import type { WorldEntity } from '../database/entities/vrchat-cache-world'
import type { FavoritedWorld, Platform, World } from '@shared/definition/vrchat-api-response'
import type { FileUrlParsedResult } from '@shared/definition/vrchat-files'
import type { LocationInstanceGroup } from '@shared/definition/vrchat-instances'
import type {
  WorldCapacity,
  WorldDetail,
  WorldFavoriteState,
  WorldPlatformPackages,
  WorldStats
} from '@shared/definition/vrchat-worlds'

export function toWorldEntity(world: World | FavoritedWorld): WorldEntity {
  const imageFileInfo = parseFileUrl(world.imageUrl)

  return {
    worldId: world.id,
    worldName: world.name,
    authorUserId: world.authorId,
    description: world.description,
    imageFileId: imageFileInfo?.fileId || '',
    imageFileVersion: imageFileInfo?.version || 0,
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

  const capacity: WorldCapacity = {
    maxCapacity: world.capacity || 0,
    recommendedCapacity: world.recommendedCapacity || 0
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
    imageFileId: imageFileInfo?.fileId || '',
    imageFileVersion: imageFileInfo?.version || 0,
    organization: world.organization,
    tags: world.tags,
    releaseStatus: world.releaseStatus,
    favorite: favoriteState,
    instanceContentSettings: world.defaultContentSettings || {},
    instances: [], // manually fetch instances via fetcher
    packages: {}, // manually fetch packages via fetcher
    capacity,
    version: world.version,
    allowUrls: world.urlList || [],
    stats: worldStats,
    labsPublicizedAt: new Date(world.labsPublicationDate),
    publicizedAt: new Date(world.publicationDate),
    updatedAt: new Date(world.updated_at),
    createdAt: new Date(world.created_at)
  }
}

export function toWorldPlatformStats(packages: World['unityPackages']) {
  if (!packages) {
    return {}
  }

  return packages.reduce<WorldPlatformPackages>((arr, pkg) => {
    if (pkg.variant === 'security' && pkg.assetUrl) {
      const fileInfo = parseFileUrl(pkg.assetUrl)!
      const platform = <Platform>pkg.platform
      arr[platform] = {
        unityPackageId: pkg.id,
        unityVersion: pkg.unityVersion,
        fileId: fileInfo?.fileId || '',
        fileVersion: fileInfo?.version || 0,
        platform: platform,
        fileSize: 0,
        uncompressedFileSize: 0,
        assetVersion: pkg.assetVersion
      }
    }
    return arr
  }, {})
}

export function toWorldDetailDependencys(world: World | FavoritedWorld) {
  const groupIds = new Set<string>()
  const assetFiles: FileUrlParsedResult[] = []

  if ('instances' in world && world.instances) {
    for (const instance of world.instances) {
      const location = parseInstance(world.id, instance[0])

      if (!location) {
        continue
      }

      if (isGroupInstance(location)) {
        const groupInstance = location as LocationInstanceGroup
        groupIds.add(groupInstance.groupId)
      }
    }
  }

  if (world.unityPackages) {
    for (const stats of Object.values(toWorldPlatformStats(world.unityPackages))) {
      assetFiles.push({
        fileId: stats.fileId,
        version: stats.fileVersion
      })
    }
  }

  return {
    groupIds: [...groupIds],
    assetFiles
  }
}

import type { InstanceContentSettings, Platform, ReleaseStatus } from './vrchat-api-response'
import type { LocationInstanceSummary } from './vrchat-instances'

export interface WorldSummary {
  worldId: string
  worldName: string
  authorUserId: string
  description: string
  imageFileId: string
  imageFileVersion: number
  organization: string
  releaseStatus: ReleaseStatus
  updatedAt: Date
}

export interface WorldDetail {
  worldId: string
  worldName: string
  authorUserId: string
  authorUserName: string
  description: string
  imageFileId: string
  imageFileVersion: number
  organization: string
  tags: string[]
  releaseStatus: ReleaseStatus
  favorite: WorldFavoriteState
  instanceContentSettings: InstanceContentSettings
  instances: WorldInstance[]
  packages: WorldPackage[]
  capacity: WorldCapacity
  stats: WorldStats
  labsPublicizedAt: Date
  publicizedAt: Date
  updatedAt: Date
  createdAt: Date
}

export interface WorldStats {
  favorites: number
  visits: number
  heat: number
  popularity: number
  totalOccupants: number
  publicOccupants: number
  privateOccupants: number
}

export interface WorldCapacity {
  maxCapacity: number
  recommendedCapacity: number
}

export type WorldFavoriteState =
  | {
      favorited: false
    }
  | {
      favorited: true
      favoriteId: string
      favoriteGroupName: string
    }

export type WorldInstance = LocationInstanceSummary & {
  occupants: number
}

export interface WorldPackage {
  unityPackageId: string
  unityVersion: string
  fileId: string
  fileVersion: number
  platform: Platform
  fileSize: number
  uncompressedFileSize: number
  assetVersion: number
}

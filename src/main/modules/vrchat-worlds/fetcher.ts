import type { LoggerFactory } from '@main/logger'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatFiles } from '../vrchat-files'
import type { WorldRepository } from './repository'
import type { WorldEntity } from '../database/entities/vrchat-cache-world'
import type { GroupEntity } from '../database/entities/vrchat-cache-group'
import type { WorldDetail } from '@shared/definition/vrchat-worlds'
import type { Platform, World } from '@shared/definition/vrchat-api-response'
import type { FileAnalysisResult } from '../vrchat-files/types'
import {
  toWorldDetail,
  toWorldDetailDependencys,
  toWorldEntity,
  toWorldPlatformStats
} from './factory'
import { limitedAllSettled } from '@shared/utils/async'
import { parseInstance } from './location-parser'
import { SAVED_WORLD_ENTITY_EXPIRE_DELAY, WORLD_ENTITIES_QUERY_THREAD_SIZE } from './constants'

export class WorldFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: WorldRepository,
    private readonly api: VRChatAPI,
    private readonly groups: VRChatGroups,
    private readonly files: VRChatFiles
  ) {}

  public async fetchWorldSummaries(worldIds: string[]): Promise<Map<string, WorldEntity>> {
    if (worldIds.length === 0) {
      return new Map()
    }

    const date = new Date()
    const entities = await this.repository.getSavedEntities(worldIds)
    const invalidIds = worldIds.filter(
      (id) =>
        !entities.has(id) ||
        date.getTime() - entities.get(id)!.cacheUpdatedAt!.getTime() >
          SAVED_WORLD_ENTITY_EXPIRE_DELAY
    )

    if (invalidIds.length > 0) {
      this.logger.info(`Fetching world entities for IDs: ${invalidIds.join(',')}`)

      const result = await limitedAllSettled(
        invalidIds.map((worldId) => {
          return async () => {
            const result = await this.api.ref.sessionAPI.worlds.getWorld(worldId)
            if (!result.success) {
              this.logger.error(
                `Failed to fetch world information for ID: ${worldId}, error: ${result.error.message}`
              )
            }
            return result
          }
        }),
        WORLD_ENTITIES_QUERY_THREAD_SIZE
      )

      const worlds = result.reduce<WorldEntity[]>((arr, current) => {
        if (current.status === 'fulfilled' && current.value.success) {
          arr.push(toWorldEntity(current.value.value.body))
        }

        return arr
      }, [])

      for (const world of worlds) {
        entities.set(world.worldId, world)
      }

      await this.repository.saveEntities(worlds)
      this.logger.info(`Fetched ${worlds.length} world entities`)
    }

    return entities
  }

  public async fetchWorldSummary(worldId: string): Promise<WorldEntity | null> {
    const entities = await this.fetchWorldSummaries([worldId])
    return entities.get(worldId) ?? null
  }

  public async fetchWorld(
    worldId: string,
    options?: { ignoreInstances?: boolean; ignorePackages?: boolean }
  ): Promise<WorldDetail | null> {
    const world = await this.api.ref.sessionAPI.worlds.getWorld(worldId)
    const { ignoreInstances = false, ignorePackages = false } = options ?? {}

    if (!world.success) {
      this.logger.error(
        `Failed to fetch world detail for ID: ${worldId}, error: ${world.error.message}`
      )
      return null
    }

    const { groupIds, assetFiles } = toWorldDetailDependencys(world.value.body)
    const entity = toWorldEntity(world.value.body)
    await this.repository.saveEntities(entity)

    const groups = !ignoreInstances ? await this.groups.fetchGroupSummaries(groupIds) : undefined
    const fileAssets = !ignorePackages ? await this.files.fetchFileAnalysis(assetFiles) : undefined

    return this.processWorldDetail(world.value.body, groups, fileAssets, {
      ignoreInstances,
      ignorePackages
    })
  }

  public processWorldDetail(
    world: World,
    groups?: Map<string, GroupEntity>,
    fileAssets?: Map<string, FileAnalysisResult>,
    options?: { ignoreInstances?: boolean; ignorePackages?: boolean }
  ): WorldDetail {
    void groups

    const detail = toWorldDetail(world)
    const { ignoreInstances = false, ignorePackages = false } = options ?? {}

    if (!ignoreInstances && world.instances) {
      for (const [instanceId, occupant] of world.instances) {
        const location = parseInstance(world.id, instanceId)!

        // if (location) {
        //   location.worldName = detail.worldName
        //   location.worldImageFileId = detail.imageFileId
        //   location.worldImageFileVersion = detail.imageFileVersion
        // }

        // if (location && isGroupInstance(location)) {
        //   const groupLocation = location as LocationInstanceGroupSummary
        //   const group = groups?.get(groupLocation.groupId) ?? null
        //   if (group) {
        //     groupLocation.groupName = group.groupName
        //     groupLocation.groupImageFileId = group.iconFileId
        //     groupLocation.groupImageFileVersion = group.iconFileVersion
        //   } else {
        //     groupLocation.groupName = 'Unknown Group'
        //   }
        // }

        detail.instances.push({
          ...location,
          occupants: +occupant
        })
      }
    }

    if (!ignorePackages && world.unityPackages) {
      const platformPackages = toWorldPlatformStats(world.unityPackages)
      for (const [key, stats] of Object.entries(platformPackages)) {
        const assets = fileAssets?.get(`${stats.fileId}-${stats.fileVersion}`)
        detail.packages[<Platform>key] = {
          ...stats,
          fileSize: assets?.fileSize ?? 0,
          uncompressedFileSize: assets?.fileUncompressedSize ?? 0
        }
      }
    }

    return detail
  }
}

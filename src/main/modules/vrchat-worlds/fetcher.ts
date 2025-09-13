import type { LoggerFactory } from '@main/logger'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatFiles } from '../vrchat-files'
import type { WorldRepository } from './repository'
import type { WorldEntity } from '../database/entities/world'
import type { GroupEntity } from '../database/entities/group'
import type { WorldDetail } from '@shared/definition/vrchat-worlds'
import type { Platform, World } from '@shared/definition/vrchat-api-response'
import type { FileAnalysisResult } from '../vrchat-files/types'
import type {
  LocationInstance,
  LocationInstanceGroupSummary,
  LocationInstanceSummary
} from '@shared/definition/vrchat-instances'
import { toWorldDetail, toWorldDetailDependencys, toWorldEntity } from './factory'
import { limitedAllSettled } from '@shared/utils/async'
import { SAVED_WORLD_ENTITY_EXPIRE_DELAY, WORLD_ENTITIES_QUERY_THREAD_SIZE } from './constants'
import { parseInstance } from './location-parser'
import { parseFileUrl } from '@shared/utils/vrchat-url-parser'
import { isGroupInstance, isSecurityAssetUrl } from './utils'

export class WorldFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: WorldRepository,
    private readonly api: VRChatAPI,
    private readonly groups: VRChatGroups,
    private readonly files: VRChatFiles
  ) {}

  public async fetchWorldSummary(worldId: string): Promise<WorldEntity | null>
  public async fetchWorldSummary(worldIds: string[]): Promise<Map<string, WorldEntity>>
  public async fetchWorldSummary(
    worldIds: string | string[]
  ): Promise<WorldEntity | Map<string, WorldEntity> | null> {
    if (Array.isArray(worldIds) && worldIds.length === 0) {
      return new Map()
    }

    const _date = new Date()
    const _worldIds = Array.isArray(worldIds) ? worldIds : [worldIds]

    // Get entity from cache
    const entities = await this.repository.getSavedEntities(_worldIds)
    const invalidIds = _worldIds.filter(
      (id) =>
        !entities.has(id) ||
        _date.getTime() - entities.get(id)!.cacheUpdatedAt!.getTime() >
          SAVED_WORLD_ENTITY_EXPIRE_DELAY
    )

    if (invalidIds.length > 0) {
      this.logger.info(`Fetching world entities for IDs: ${invalidIds.join(',')}`)

      const result = await limitedAllSettled(
        invalidIds.map((worldId) => {
          return async () => this.api.ref.sessionAPI.worlds.getWorld(worldId)
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

    return Array.isArray(worldIds) ? entities : (entities.get(worldIds) ?? null)
  }

  public async fetchWorld(
    worldId: string,
    options?: { ignoreInstances?: boolean; ignorePackages?: boolean }
  ): Promise<WorldDetail | null> {
    const world = await this.api.ref.sessionAPI.worlds.getWorld(worldId)
    const { ignoreInstances = false, ignorePackages = false } = options ?? {}

    if (!world.success) {
      return null
    }

    const entity = toWorldEntity(world.value.body)
    await this.repository.saveEntities(entity)

    const { groupIds, assetFiles } = toWorldDetailDependencys(world.value.body)
    const groups = !ignoreInstances ? await this.groups.Fetcher.fetchGroupEntities(groupIds) : null
    const fileAssets = !ignorePackages
      ? await this.files.Fetcher.fetchFileAnalysis(assetFiles)
      : null

    return this.processWorldDetail(world.value.body, groups, fileAssets, {
      ignoreInstances,
      ignorePackages
    })
  }

  public async enrichLocationWithWorldInfo(location: LocationInstance) {
    const world = await this.fetchWorldSummary(location.worldId)
    const summary = <LocationInstanceSummary>{
      ...location,
      worldName: 'Unknown World',
      worldImageFileId: '',
      worldImageFileVersion: 0
    }

    if (world) {
      summary.worldName = world.worldName
      summary.worldImageFileId = world.imageFileId
      summary.worldImageFileVersion = world.imageFileVersion
    }

    return summary
  }

  public async processWorldDetail(
    world: World,
    groups: Map<string, GroupEntity> | null,
    fileAssets: Map<string, FileAnalysisResult> | null,
    options?: { ignoreInstances?: boolean; ignorePackages?: boolean }
  ): Promise<WorldDetail> {
    const detail = toWorldDetail(world)
    const { ignoreInstances = false, ignorePackages = false } = options ?? {}

    if (!ignoreInstances && world.instances) {
      for (const instance of world.instances) {
        const location = <LocationInstanceSummary>parseInstance(world.id, instance[0])

        if (location) {
          location.worldName = detail.worldName
          location.worldImageFileId = detail.imageFileId
          location.worldImageFileVersion = detail.imageFileVersion
        }

        if (location && isGroupInstance(location)) {
          const groupLocation = location as LocationInstanceGroupSummary
          const group = groups?.get(groupLocation.groupId) ?? null
          if (group) {
            groupLocation.groupName = group.groupName
            groupLocation.groupImageFileId = group.iconFileId
            groupLocation.groupImageFileVersion = group.iconFileVersion
          } else {
            groupLocation.groupName = 'Unknown Group'
          }
        }

        detail.instances.push({
          ...location,
          occupants: +instance[1]
        })
      }
    }

    if (!ignorePackages && world.unityPackages) {
      for (const unityPackage of world.unityPackages) {
        if (!unityPackage.assetUrl || !isSecurityAssetUrl(unityPackage.assetUrl)) {
          continue
        }

        const fileInfo = parseFileUrl(unityPackage.assetUrl || '')
        const asset = fileAssets?.get(`${fileInfo.fileId}-${fileInfo.version}`) ?? null

        detail.packages.push({
          unityPackageId: unityPackage.id,
          unityVersion: unityPackage.unityVersion,
          fileId: fileInfo.fileId,
          fileVersion: fileInfo.version,
          platform: <Platform>unityPackage.platform,
          fileSize: asset?.fileSize ?? 0,
          uncompressedFileSize: asset?.fileUncompressedSize ?? 0,
          assetVersion: unityPackage.assetVersion
        })
      }
    }

    return detail
  }
}

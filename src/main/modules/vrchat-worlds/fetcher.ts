import type { LoggerFactory } from '@main/logger'
import { toWorldEntity } from './factory'
import { limitedAllSettled } from '@shared/utils/async'
import { WorldEntity } from '../database/entities/world'
import { WorldRepository } from './repository'
import { VRChatAPI } from '../vrchat-api'
import { SAVED_WORLD_ENTITY_EXPIRE_DELAY } from './constants'

export class WorldFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: WorldRepository,
    private readonly api: VRChatAPI
  ) {}

  public async fetchWorldEntities(worldId: string): Promise<WorldEntity | null>
  public async fetchWorldEntities(worldIds: string[]): Promise<Map<string, WorldEntity>>
  public async fetchWorldEntities(
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
        _date.getTime() - entities.get(id)!.cacheUpdatedAt.getTime() >
          SAVED_WORLD_ENTITY_EXPIRE_DELAY
    )

    if (invalidIds.length > 0) {
      this.logger.info(`Fetching world entities for IDs: ${invalidIds.join(',')}`)

      const result = await limitedAllSettled(
        invalidIds.map((worldId) => {
          return async () => this.api.ref.sessionAPI.worlds.getWorld(worldId)
        }),
        10
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
}

import { toWorldEntity } from './factory'
import { limitedAllSettled } from '@shared/utils/async'
import { WorldEntity } from '../database/entities/world'
import { WorldRepository } from './repository'
import { VRChatAPI } from '../vrchat-api'
import { SAVED_WORLD_ENTITY_EXPIRE_DELAY } from './constants'

export class WorldFetcher {
  constructor(
    private readonly repository: WorldRepository,
    private readonly api: VRChatAPI
  ) {}

  public async fetchWorldEntities(worldId: string): Promise<WorldEntity | null>
  public async fetchWorldEntities(worldIds: string[]): Promise<Map<string, WorldEntity>>
  public async fetchWorldEntities(
    worldIds: string | string[]
  ): Promise<WorldEntity | Map<string, WorldEntity> | null> {
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
    return Array.isArray(worldIds) ? entities : (entities.get(worldIds) ?? null)
  }
}

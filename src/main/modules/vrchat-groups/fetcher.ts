import type { LoggerFactory } from '@main/logger'
import { toGroupEntity } from './factory'
import { limitedAllSettled } from '@shared/utils/async'
import { GroupEntity } from '../database/entities/group'
import { GroupRepository } from './repository'
import { VRChatAPI } from '../vrchat-api'
import { GROUP_ENTITIES_QUERY_THREAD_SIZE, SAVED_GROUP_ENTITY_EXPIRE_DELAY } from './constants'

export class GroupFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: GroupRepository,
    private readonly api: VRChatAPI
  ) {}

  public async fetchGroupEntities(groupId: string): Promise<GroupEntity | null>
  public async fetchGroupEntities(groupIds: string[]): Promise<Map<string, GroupEntity>>
  public async fetchGroupEntities(
    groupIds: string | string[]
  ): Promise<GroupEntity | Map<string, GroupEntity> | null> {
    if (Array.isArray(groupIds) && groupIds.length === 0) {
      return new Map()
    }

    const _date = new Date()
    const _worldIds = Array.isArray(groupIds) ? groupIds : [groupIds]

    // Get entity from cache
    const entities = await this.repository.getSavedEntities(_worldIds)
    const invalidIds = _worldIds.filter(
      (id) =>
        !entities.has(id) ||
        _date.getTime() - entities.get(id)!.cacheUpdatedAt!.getTime() >
          SAVED_GROUP_ENTITY_EXPIRE_DELAY
    )

    if (invalidIds.length > 0) {
      this.logger.info(`Fetching group entities for IDs: ${invalidIds.join(',')}`)

      const result = await limitedAllSettled(
        invalidIds.map((worldId) => {
          return async () => this.api.ref.sessionAPI.groups.getGroup(worldId)
        }),
        GROUP_ENTITIES_QUERY_THREAD_SIZE
      )

      const worlds = result.reduce<GroupEntity[]>((arr, current) => {
        if (current.status === 'fulfilled' && current.value.success) {
          arr.push(toGroupEntity(current.value.value.body))
        }

        return arr
      }, [])

      for (const world of worlds) {
        entities.set(world.groupId, world)
      }

      this.logger.info(`Fetched ${worlds.length} group entities`)
      await this.repository.saveEntities(worlds)
    }

    return Array.isArray(groupIds) ? entities : (entities.get(groupIds) ?? null)
  }
}

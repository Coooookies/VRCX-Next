import type { LoggerFactory } from '@main/logger'
import { toGroupEntity } from './factory'
import { limitedAllSettled } from '@shared/utils/async'
import { GroupEntity } from '../database/entities/vrchat-cache-group'
import { GroupRepository } from './repository'
import { VRChatAPI } from '../vrchat-api'
import { GROUP_ENTITIES_QUERY_THREAD_SIZE, SAVED_GROUP_ENTITY_EXPIRE_DELAY } from './constants'

export class GroupFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: GroupRepository,
    private readonly api: VRChatAPI
  ) {}

  public async fetchGroupSummaries(
    groupIds: string[],
    ignoreExpiration?: boolean
  ): Promise<Map<string, GroupEntity>> {
    const date = new Date()

    // Get entity from cache
    const entities = await this.repository.getSavedEntities(groupIds)
    const invalidIds = groupIds.filter((id) => {
      if (!entities.has(id)) {
        return true
      }

      const expired =
        date.getTime() - entities.get(id)!.cacheUpdatedAt!.getTime() >
        SAVED_GROUP_ENTITY_EXPIRE_DELAY

      if (!ignoreExpiration && expired) {
        return true
      }

      return false
    })

    if (invalidIds.length > 0) {
      this.logger.info(`Fetching group entities for IDs: ${invalidIds.join(',')}`)

      const result = await limitedAllSettled(
        invalidIds.map((worldId) => {
          return async () => {
            const result = await this.api.ref.sessionAPI.groups.getGroup(worldId)
            if (!result.success) {
              this.logger.error(
                `Failed to fetch group information for ID: ${worldId}, error: ${result.error.message}`
              )
            }

            return result
          }
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

    return entities
  }

  public async fetchGroupSummary(
    groupId: string,
    ignoreExpiration?: boolean
  ): Promise<GroupEntity | null> {
    const entities = await this.fetchGroupSummaries([groupId], ignoreExpiration)
    return entities.get(groupId) ?? null
  }
}

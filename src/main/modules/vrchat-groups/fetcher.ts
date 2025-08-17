import { toGroupEntity } from './factory'
import { limitedAllSettled } from '@shared/utils/async'
import { GroupEntity } from '../database/entities/group'
import { GroupRepository } from './repository'
import { VRChatAPI } from '../vrchat-api'
import { SAVED_GROUP_ENTITY_EXPIRE_DELAY } from './constants'

export class GroupFetcher {
  constructor(
    private readonly repository: GroupRepository,
    private readonly api: VRChatAPI
  ) {}

  public async fetchWorldEntities(groupId: string): Promise<GroupEntity | null>
  public async fetchWorldEntities(groupIds: string[]): Promise<Map<string, GroupEntity>>
  public async fetchWorldEntities(
    groupIds: string | string[]
  ): Promise<GroupEntity | Map<string, GroupEntity> | null> {
    const _date = new Date()
    const _worldIds = Array.isArray(groupIds) ? groupIds : [groupIds]

    // Get entity from cache
    const entities = await this.repository.getSavedEntities(_worldIds)
    const invalidIds = _worldIds.filter(
      (id) =>
        !entities.has(id) ||
        _date.getTime() - entities.get(id)!.cacheUpdatedAt.getTime() >
          SAVED_GROUP_ENTITY_EXPIRE_DELAY
    )

    const result = await limitedAllSettled(
      invalidIds.map((worldId) => {
        return async () => this.api.ref.sessionAPI.groups.getGroup(worldId)
      }),
      10
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

    await this.repository.saveEntities(worlds)
    return Array.isArray(groupIds) ? entities : (entities.get(groupIds) ?? null)
  }
}

import type { LoggerFactory } from '@main/logger'
import type { UsersRepository } from './repository'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatGroups } from '../vrchat-groups'
import type { UserNote } from '@shared/definition/vrchat-api-response'
import type { UserEntity } from '../database/entities/users'
import type { LocationInstance } from '@shared/definition/vrchat-instances'
import { limitedAllSettled } from '@shared/utils/async'
import { isGroupInstance } from '../vrchat-worlds/utils'
import { toUserEntity } from './factory'
import {
  SAVED_USER_ENTITY_EXPIRE_DELAY,
  USER_ENTITIES_QUERY_THREAD_SIZE,
  USERNOTES_QUERY_SIZE
} from './constants'

export class UsersFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: UsersRepository,
    private readonly api: VRChatAPI,
    private readonly worlds: VRChatWorlds,
    private readonly groups: VRChatGroups
  ) {}

  public async initNotes() {
    let startOffset = 0
    let notes: UserNote[] = []

    while (true) {
      const result = await this.api.ref.sessionAPI.users.getNotes(startOffset, USERNOTES_QUERY_SIZE)

      if (!result.success) {
        this.logger.warn('Failed to fetch users note')
        break
      }

      const notesBatch = result.value.body

      if (notesBatch.length === 0) {
        break
      }

      notes = notes.concat(notesBatch)
      startOffset += notesBatch.length

      this.logger.info(`Fetched ${notes.length} user notes, total: ${notes.length}`)

      if (notesBatch.length < USERNOTES_QUERY_SIZE) {
        break
      }
    }

    this.repository.setNotes(
      notes.map((note) => ({
        userId: note.targetUserId,
        noteId: note.id,
        note: note.note,
        createdAt: new Date(note.createdAt)
      }))
    )
  }

  public async fetchUserEntities(
    userId: string,
    ignoreExpiration?: boolean
  ): Promise<UserEntity | null>
  public async fetchUserEntities(
    userIds: string[],
    ignoreExpiration?: boolean
  ): Promise<Map<string, UserEntity>>
  public async fetchUserEntities(
    userIds: string | string[],
    ignoreExpiration?: boolean
  ): Promise<UserEntity | Map<string, UserEntity> | null> {
    if (Array.isArray(userIds) && userIds.length === 0) {
      return new Map()
    }

    const _date = new Date()
    const _userIds = Array.isArray(userIds) ? userIds : [userIds]

    // Get entity from cache
    const entities = await this.repository.getSavedUserEntities(_userIds)
    const invalidIds = _userIds.filter((id) => {
      if (!entities.has(id)) {
        return true
      }

      const expired =
        _date.getTime() - entities.get(id)!.cacheUpdatedAt!.getTime() >
        SAVED_USER_ENTITY_EXPIRE_DELAY

      if (!ignoreExpiration && expired) {
        return true
      }

      return false
    })

    if (invalidIds.length > 0) {
      this.logger.info(`Fetching users entities for IDs: ${invalidIds.join(',')}`)

      const result = await limitedAllSettled(
        invalidIds.map((userId) => {
          return async () => this.api.ref.sessionAPI.users.getUser(userId)
        }),
        USER_ENTITIES_QUERY_THREAD_SIZE
      )

      const users = result.reduce<UserEntity[]>((arr, current) => {
        if (current.status === 'fulfilled' && current.value.success) {
          arr.push(toUserEntity(current.value.value.body))
        }

        return arr
      }, [])

      for (const user of users) {
        entities.set(user.userId, user)
      }

      await this.repository.saveUserEntities(users)
      this.logger.info(`Fetched ${users.length} users entities`)
    }

    return Array.isArray(userIds) ? entities : (entities.get(userIds) ?? null)
  }

  public async enrichLocation(location: LocationInstance) {
    let nextLocationSummary = await this.worlds.Fetcher.enrichLocationWithWorldInfo(location)

    if (isGroupInstance(nextLocationSummary)) {
      nextLocationSummary =
        await this.groups.Fetcher.enrichLocationWithGroupInfo(nextLocationSummary)
    }

    return nextLocationSummary
  }
}

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
import { toUserEntity, toUserInformation } from './factory'
import {
  SAVED_USER_ENTITY_EXPIRE_DELAY,
  USER_ENTITIES_QUERY_THREAD_SIZE,
  USERNOTES_QUERY_SIZE
} from './constants'
import { UserInformation } from '@shared/definition/vrchat-users'

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

  public async fetchUserSummary(
    userId: string,
    ignoreExpiration?: boolean
  ): Promise<UserEntity | null>
  public async fetchUserSummary(
    userIds: string[],
    ignoreExpiration?: boolean
  ): Promise<Map<string, UserEntity>>
  public async fetchUserSummary(
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

  public async fetchUser(userId: string): Promise<UserInformation | null>
  public async fetchUser(userIds: string[]): Promise<Map<string, UserInformation>>
  public async fetchUser(
    userIds: string | string[]
  ): Promise<UserInformation | Map<string, UserInformation> | null> {
    if (Array.isArray(userIds) && userIds.length === 0) {
      return new Map()
    }

    const _userIds = Array.isArray(userIds) ? userIds : [userIds]
    const users = new Map<string, UserInformation>()
    const entities = new Map<string, UserEntity>()

    const result = await limitedAllSettled(
      _userIds.map((userId) => {
        return async () => this.api.ref.sessionAPI.users.getUser(userId)
      }),
      USER_ENTITIES_QUERY_THREAD_SIZE
    )

    for (const res of result) {
      if (res.status === 'fulfilled' && res.value.success) {
        const detail = toUserInformation(res.value.value.body)
        const entity = toUserEntity(res.value.value.body)
        users.set(detail.userId, detail)
        entities.set(entity.userId, entity)
      }
    }

    await this.repository.saveUserEntities([...entities.values()])
    return Array.isArray(userIds) ? users : (users.get(userIds) ?? null)
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

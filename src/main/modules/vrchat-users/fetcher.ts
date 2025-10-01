import type { LoggerFactory } from '@main/logger'
import type { UsersRepository } from './repository'
import type { VRChatAPI } from '../vrchat-api'
import type { UserEntityProcessHandler, UserProcessHandler } from './types'
import type { UserInformation } from '@shared/definition/vrchat-users'
// import type { UserNote } from '@shared/definition/vrchat-api-response'
import type { UserEntity } from '../database/entities/vrchat-cache-users'
import { limitedAllSettled } from '@shared/utils/async'
import { toUserEntity, toUserInformation } from './factory'
import {
  SAVED_USER_ENTITY_EXPIRE_DELAY,
  USER_ENTITIES_QUERY_THREAD_SIZE
  // USERNOTES_QUERY_SIZE
} from './constants'

export class UsersFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: UsersRepository,
    private readonly api: VRChatAPI
  ) {}

  // public async fetchNotes() {
  //   let startOffset = 0
  //   let notes: UserNote[] = []

  //   while (true) {
  //     const result = await this.api.ref.sessionAPI.users.getNotes(startOffset, USERNOTES_QUERY_SIZE)

  //     if (!result.success) {
  //       this.logger.error('Failed to fetch users note')
  //       break
  //     }

  //     const notesBatch = result.value.body

  //     if (notesBatch.length === 0) {
  //       break
  //     }

  //     notes = notes.concat(notesBatch)
  //     startOffset += notesBatch.length

  //     this.logger.info(`Fetched ${notes.length} user notes, total: ${notes.length}`)

  //     if (notesBatch.length < USERNOTES_QUERY_SIZE) {
  //       break
  //     }
  //   }

  //   this.repository.setNotes(
  //     notes.map((note) => ({
  //       userId: note.targetUserId,
  //       noteId: note.id,
  //       note: note.note,
  //       createdAt: new Date(note.createdAt)
  //     }))
  //   )
  // }

  public async fetchUserSummary(
    userId: string,
    ignoreExpiration?: boolean
  ): Promise<UserEntity | null> {
    const entities = await this.fetchUserSummaries([userId], ignoreExpiration)
    return entities.get(userId) ?? null
  }

  public async fetchUserSummaries(
    userIds: string[],
    ignoreExpiration?: boolean,
    processHandler?: UserEntityProcessHandler
  ): Promise<Map<string, UserEntity>> {
    const date = new Date()
    const entities = await this.repository.getSavedUserEntities(userIds)
    const invalidIds = userIds.filter((id) => {
      if (!entities.has(id)) {
        return true
      }

      const expired =
        date.getTime() - entities.get(id)!.cacheUpdatedAt!.getTime() >
        SAVED_USER_ENTITY_EXPIRE_DELAY

      if (!ignoreExpiration && expired) {
        return true
      }

      return false
    })

    if (entities.size > 0) {
      processHandler?.([...entities.values()])
    }

    if (invalidIds.length > 0) {
      this.logger.info(`Fetching users entities for IDs: ${invalidIds.join(',')}`)

      const result = await limitedAllSettled(
        invalidIds.map((userId) => {
          return async () => {
            const result = await this.api.ref.sessionAPI.users.getUser(userId)
            if (result.success) {
              processHandler?.([toUserEntity(result.value.body)])
            } else {
              this.logger.error(
                `Failed to fetch user entity for ID: ${userId}, error: ${result.error.message}`
              )
            }

            return result
          }
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

    return entities
  }

  public async fetchUser(userId: string): Promise<UserInformation | null> {
    const { success, value, error } = await this.api.ref.sessionAPI.users.getUser(userId)
    this.logger.info(`Fetching user information for ID: ${userId}`)

    if (success) {
      const entity = toUserEntity(value.body)
      await this.repository.saveUserEntities(entity)
      return toUserInformation(value.body)
    } else {
      this.logger.error(
        `Failed to fetch user information for ID: ${userId}, error: ${error.message}`
      )
    }

    return null
  }

  public async fetchUsers(
    userIds: string[],
    processHandler?: UserProcessHandler
  ): Promise<Map<string, UserInformation>> {
    const users = new Map<string, UserInformation>()
    const entities = new Map<string, UserEntity>()

    const result = await limitedAllSettled(
      userIds.map((userId) => {
        return async () => {
          const result = await this.api.ref.sessionAPI.users.getUser(userId)
          if (result.success) {
            processHandler?.(toUserInformation(result.value.body))
          }

          return result
        }
      }),
      USER_ENTITIES_QUERY_THREAD_SIZE
    )

    for (const res of result) {
      if (res.status !== 'fulfilled') {
        continue
      }

      if (res.value.success) {
        const detail = toUserInformation(res.value.value.body)
        const entity = toUserEntity(res.value.value.body)
        users.set(detail.userId, detail)
        entities.set(entity.userId, entity)
      } else {
        this.logger.error(`Failed to fetch user information, error: ${res.value.error.message}`)
      }
    }

    await this.repository.saveUserEntities([...entities.values()])
    return users
  }

  // public async fetchUserLocation(userId: string): Promise<string | null> {
  //   const { success, value, error } = await this.api.ref.sessionAPI.users.getUser(userId)
  //   if (!success) {
  //     this.logger.error(`Failed to fetch user location for ID: ${userId} , error: ${error.message}`)
  //     return null
  //   }

  //   const user = value.body
  //   const entity = toUserEntity(user)
  //   await this.repository.saveUserEntities(entity)
  //   return user.location || null
  // }
}

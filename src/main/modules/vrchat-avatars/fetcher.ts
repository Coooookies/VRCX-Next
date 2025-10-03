import type { LoggerFactory } from '@main/logger'
import type { AvatarReferenceEntity } from '../database/entities/vrchat-cache-avatar-reference'
import type { AvatarRepository } from './repository'
import type { VRChatAPI } from '../vrchat-api'
import {
  AVATAR_REFERENCE_ENTITIES_QUERY_THREAD_SIZE,
  SAVED_AVATAR_REFERENCE_ENTITY_EXPIRE_DELAY
} from './constants'
import { limitedAllSettled } from '@shared/utils/async'
import { toAvatarReferenceEntity } from './factory'

export class AvatarFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: AvatarRepository,
    private readonly api: VRChatAPI
  ) {}

  public async fetchReferenceAvatars(
    fileIds: string[],
    ignoreExpiration?: boolean
  ): Promise<Map<string, AvatarReferenceEntity>> {
    if (fileIds.length === 0) {
      return new Map()
    }

    const date = new Date()
    const entities = await this.repository.getSavedRefAvatarEntities(fileIds)
    const invalidIds = fileIds.filter((id) => {
      if (!entities.has(id)) {
        return true
      }

      const expired =
        date.getTime() - entities.get(id)!.cacheUpdatedAt!.getTime() >
        SAVED_AVATAR_REFERENCE_ENTITY_EXPIRE_DELAY

      if (!ignoreExpiration && expired) {
        return true
      }

      return false
    })

    if (invalidIds.length > 0) {
      this.logger.info(`Fetching avatar references for IDs: ${invalidIds.join(',')}`)

      const result = await limitedAllSettled(
        invalidIds.map((fileId) => {
          return async () => {
            const result = await this.api.ref.sessionAPI.files.getFile(fileId)
            if (!result.success) {
              this.logger.error(
                `Failed to fetch avatar reference for ID: ${fileId}, error: ${result.error.message}`
              )
            }
            return result
          }
        }),
        AVATAR_REFERENCE_ENTITIES_QUERY_THREAD_SIZE
      )

      const files = result.reduce<AvatarReferenceEntity[]>((arr, current) => {
        if (current.status === 'fulfilled' && current.value.success) {
          arr.push(toAvatarReferenceEntity(current.value.value.body))
        }

        return arr
      }, [])

      for (const file of files) {
        entities.set(file.fileId, file)
      }

      await this.repository.saveRefAvatarEntities(files)
      this.logger.info(`Fetched ${files.length} avatar reference entities`)
    }

    return entities
  }

  public async fetchReferenceAvatar(
    fileId: string,
    ignoreExpiration?: boolean
  ): Promise<AvatarReferenceEntity | null> {
    const entities = await this.fetchReferenceAvatars([fileId], ignoreExpiration)
    return entities.get(fileId) ?? null
  }
}

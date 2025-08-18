import type { LoggerFactory } from '@main/logger'
import type { UsersRepository } from './repository'
import type { VRChatAPI } from '../vrchat-api'
import type { UserNote } from '@shared/definition/vrchat-api-response'
import { USERNOTES_QUERY_SIZE } from './constants'

export class UsersFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: UsersRepository,
    private readonly api: VRChatAPI
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
}

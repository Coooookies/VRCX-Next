import { In } from 'typeorm'
import { UserEntity } from '../database/entities/vrchat-cache-users'
import type { Database } from '../database'
import type { Repository } from 'typeorm'
// import type { UserNoteInformation } from './types'

export class UsersRepository {
  constructor(private readonly database: Database) {}

  public get repository(): Repository<UserEntity> {
    return this.database.source.getRepository(UserEntity)
  }

  // private readonly notes = new Map<string, UserNoteInformation>()

  // public getNote(userId: string) {
  //   return this.notes.get(userId)
  // }

  // public getAllNotes() {
  //   return [...this.notes.values()]
  // }

  // public setNotes(notes: UserNoteInformation | UserNoteInformation[]) {
  //   const pendingNotes = Array.isArray(notes) ? notes : [notes]

  //   for (const note of pendingNotes) {
  //     this.notes.set(note.userId, note)
  //   }

  //   this.emit('notes:update', pendingNotes)
  // }

  // public deleteNote(userId: string) {
  //   const deleted = this.notes.delete(userId)
  //   if (deleted) {
  //     this.emit('notes:delete', userId)
  //   }
  //   return deleted
  // }

  // public clearNotes() {
  //   this.notes.clear()
  //   this.emit('notes:clear')
  // }

  // public hasNote(userId: string): boolean {
  //   return this.notes.has(userId)
  // }

  public async getSavedUserEntities(userId: string): Promise<UserEntity | null>
  public async getSavedUserEntities(userIds: string[]): Promise<Map<string, UserEntity>>
  public async getSavedUserEntities(
    userIds: string | string[]
  ): Promise<UserEntity | Map<string, UserEntity> | null> {
    const pendingUserId = Array.isArray(userIds) ? userIds : [userIds]
    const savedEntities = await this.repository.find({
      where: {
        userId: In(pendingUserId)
      }
    })

    if (Array.isArray(userIds)) {
      const entityMap = new Map<string, UserEntity>()
      for (const entity of savedEntities) {
        entityMap.set(entity.userId, entity)
      }
      return entityMap
    } else {
      return savedEntities.length > 0 ? savedEntities[0] : null
    }
  }

  public async saveUserEntities(entities: UserEntity | UserEntity[]) {
    const entitiesArr = Array.isArray(entities) ? entities : [entities]
    return this.repository.upsert(entitiesArr, {
      conflictPaths: ['userId'],
      skipUpdateIfNoValuesChanged: true
    })
  }
}

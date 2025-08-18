import Nanobus from 'nanobus'
import type { UserNoteInformation } from './types'

export class UsersRepository extends Nanobus<{
  'notes:update': (friends: UserNoteInformation[]) => void
  'notes:delete': (userId: string) => void
  'notes:clear': () => void
}> {
  private readonly notes = new Map<string, UserNoteInformation>()

  public getNote(userId: string) {
    return this.notes.get(userId)
  }

  public getAllNotes() {
    return [...this.notes.values()]
  }

  public setNotes(notes: UserNoteInformation | UserNoteInformation[]) {
    const pendingNotes = Array.isArray(notes) ? notes : [notes]

    for (const note of pendingNotes) {
      this.notes.set(note.userId, note)
    }

    this.emit('notes:update', pendingNotes)
  }

  public deleteNote(userId: string) {
    const deleted = this.notes.delete(userId)
    if (deleted) {
      this.emit('notes:delete', userId)
    }
    return deleted
  }

  public clearNotes() {
    this.notes.clear()
    this.emit('notes:clear')
  }

  public hasNote(userId: string): boolean {
    return this.notes.has(userId)
  }
}

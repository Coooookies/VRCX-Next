import type { CurrentUserInformation, UserInformation } from '@shared/definition/vrchat-users'
import type { UserEntity } from '../database/entities/vrchat-cache-users'

export interface UserNoteInformation {
  createdAt: Date
  noteId: string
  userId: string
  note: string
}

export type UserEntityProcessHandler = (users: UserEntity[]) => void
export type UserProcessHandler = (user: UserInformation) => void
export type UserUpdateDiff = {
  before: Partial<CurrentUserInformation>
  after: Partial<CurrentUserInformation>
}

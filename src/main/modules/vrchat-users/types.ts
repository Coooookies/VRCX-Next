import type { UserInformation } from '@shared/definition/vrchat-users'
import type { UserEntity } from '../database/entities/users'

export interface UserNoteInformation {
  createdAt: Date
  noteId: string
  userId: string
  note: string
}

export type UserEntityProcessHandler = (users: UserEntity[]) => void
export type UserProcessHandler = (user: UserInformation) => void

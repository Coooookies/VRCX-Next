import { attempt } from '@shared/utils/async'
import type { Got, Response, HTTPError } from 'got'
import type {
  CurrentUser,
  ErrorResponse,
  TwoFactorRecoveryCodes,
  User,
  UserNote
} from '@shared/definition/vrchat-api-response'

type LoginResult = CurrentUser & TwoFactorRecoveryCodes

export class Users {
  constructor(private client: Got) {}

  getNotes(offset: number, n: number) {
    return attempt<Response<UserNote[]>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get('userNotes', {
        responseType: 'json',
        searchParams: {
          offset,
          n
        }
      })
    )
  }

  getUser(userId: string) {
    return attempt<Response<User>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get(`users/${userId}`, {
        responseType: 'json'
      })
    )
  }

  getCurrentUser() {
    return attempt<Response<LoginResult>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get('auth/user', {
        responseType: 'json'
      })
    )
  }
}

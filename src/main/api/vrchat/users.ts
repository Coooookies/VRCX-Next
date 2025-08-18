import { attempt } from '@shared/utils/async'
import type { Got, Response, HTTPError } from 'got'
import type { ErrorResponse, UserNote } from '@shared/definition/vrchat-api-response'

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
}

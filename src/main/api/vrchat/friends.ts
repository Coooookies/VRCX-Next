import { attempt } from '@shared/utils/async'
import type { Got, Response, HTTPError } from 'got'
import type { ErrorResponse, LimitedUserFriend } from '@shared/definition/vrchat-api-response'

export class Friends {
  constructor(private client: Got) {}

  public getFriends(
    offset: number,
    n: number,
    option: {
      offline?: boolean
    } = {}
  ) {
    return attempt<Response<LimitedUserFriend>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.post('auth/user/friends', {
        responseType: 'json',
        searchParams: {
          offline: option.offline,
          offset,
          n
        }
      })
    )
  }
}

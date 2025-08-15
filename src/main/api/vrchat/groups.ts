import { attempt } from '@shared/utils/async'
import type { Got, Response, HTTPError } from 'got'
import type { ErrorResponse, Group } from '@shared/definition/vrchat-api-response'

export class Groups {
  constructor(private client: Got) {}

  getGroup(groupId: string) {
    return attempt<Response<Group>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get(`groups/${groupId}`, {
        responseType: 'json'
      })
    )
  }
}

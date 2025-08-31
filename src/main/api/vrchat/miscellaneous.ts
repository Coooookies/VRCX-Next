import { attempt } from '@shared/utils/async'
import type { Got, Response, HTTPError } from 'got'
import type { ErrorResponse } from '@shared/definition/vrchat-api-response'

export class Miscellaneous {
  constructor(private client: Got) {}

  public getServerTime() {
    return attempt<Response<string>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get(`time`)
    )
  }
}

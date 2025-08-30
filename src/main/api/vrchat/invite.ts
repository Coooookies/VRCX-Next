import { attempt } from '@shared/utils/async'
import type { Got, Response, HTTPError } from 'got'
import type { ErrorResponse, Notification } from '@shared/definition/vrchat-api-response'

export class Invite {
  constructor(private client: Got) {}

  public respondInvite(
    notificationId: string,
    responseSlot: number,
    option: {
      rsvp?: boolean
    } = {}
  ) {
    return attempt<Response<Notification>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.post(`invite/${notificationId}/response`, {
        responseType: 'json',
        json: {
          responseSlot,
          rsvp: option.rsvp
        }
      })
    )
  }

  public respondInviteWithPhoto(
    notificationId: string,
    responseSlot: number,
    image: {
      streamableFile: File
      filename: string
    },
    option: {
      rsvp?: boolean
    } = {}
  ) {
    const form = new FormData()

    form.append('image', image.streamableFile, image.filename)
    form.append(
      'data',
      JSON.stringify({
        responseSlot,
        rsvp: option.rsvp
      })
    )

    return attempt<Response<Notification>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.post(`invite/${notificationId}/response`, {
        responseType: 'json',
        body: form,
        headers: {
          ContentType: 'multipart/form-data'
        }
      })
    )
  }
}

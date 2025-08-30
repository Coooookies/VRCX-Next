import { attempt } from '@shared/utils/async'
import type { Got, Response, HTTPError } from 'got'
import type {
  ErrorResponse,
  Notification,
  NotificationV2,
  NotificationV2ResponseType,
  Success
} from '@shared/definition/vrchat-api-response'

export class Notifications {
  constructor(private client: Got) {}

  public getNotification(notificationId: string) {
    return attempt<Response<Notification>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get(`/auth/user/notifications/${notificationId}`, {
        responseType: 'json'
      })
    )
  }

  public getNotifications(
    offset: number,
    n: number,
    option: {
      hidden?: boolean
      after?: string
    } = {}
  ) {
    return attempt<Response<Notification[]>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get('auth/user/notifications', {
        responseType: 'json',
        searchParams: {
          offset,
          n,
          hidden: option.hidden,
          after: option.after
        }
      })
    )
  }

  public getNotificationsV2(offset: number, n: number) {
    return attempt<Response<NotificationV2[]>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get('notifications', {
        responseType: 'json',
        searchParams: {
          offset,
          n
        }
      })
    )
  }

  public deleteNotification(notificationId: string) {
    return attempt<Response<Notification>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.put(`auth/user/notifications/${notificationId}/hide`, {
        responseType: 'json'
      })
    )
  }

  public deleteNotificationV2(notificationId: string) {
    return attempt<Response<Success>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.delete(`notifications/${notificationId}`, {
        responseType: 'json'
      })
    )
  }

  public markNotificationAsRead(notificationId: string) {
    return attempt<Response<Notification>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.put(`auth/user/notifications/${notificationId}/see`, {
        responseType: 'json'
      })
    )
  }

  public acceptFriendRequest(notificationId: string) {
    return attempt<Response<Success>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.put(`auth/user/notifications/${notificationId}/accept`, {
        responseType: 'json'
      })
    )
  }

  public respondToNotificationV2(
    notificationId: string,
    type: NotificationV2ResponseType,
    data: string
  ) {
    return attempt<Response<string>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.post(`notifications/${notificationId}/respond`, {
        responseType: 'text',
        json: {
          responseType: type,
          responseData: data
        }
      })
    )
  }

  public clearNotificationsV1() {
    return attempt<Response<Success>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.put('auth/user/notifications/clear', {
        responseType: 'json'
      })
    )
  }

  public clearNotificationsV2() {
    return attempt<Response<Success>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.delete('notifications', {
        responseType: 'json'
      })
    )
  }
}

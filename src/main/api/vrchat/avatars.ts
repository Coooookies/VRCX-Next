import { attempt } from '@shared/utils/async'
import type { Got, HTTPError, Response } from 'got'
import type {
  Avatar,
  ErrorResponse,
  OrderOption,
  ReleaseStatus,
  SortOption
} from '@shared/definition/vrchat-api-response'

export class Avatars {
  constructor(private client: Got) {}

  public getFavoriteAvatars(
    offset: number,
    n: number,
    option: {
      featured?: boolean
      sort?: SortOption
      order?: OrderOption
      search?: string
      tag?: string
      notag?: string
      releaseStatus?: ReleaseStatus
      maxUnityVersion?: string
      minUnityVersion?: string
      platform?: string
      userId?: string
    } = {}
  ) {
    return attempt<Response<Avatar[]>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.post('avatars/favorites', {
        responseType: 'json',
        searchParams: {
          offset,
          n,
          featured: option.featured,
          sort: option.sort,
          order: option.order,
          search: option.search,
          tag: option.tag,
          notag: option.notag,
          releaseStatus: option.releaseStatus,
          maxUnityVersion: option.maxUnityVersion,
          minUnityVersion: option.minUnityVersion,
          platform: option.platform,
          userId: option.userId
        }
      })
    )
  }

  public getAvatar(avatarId: string) {
    return attempt<Response<Avatar>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get(`avatars/${avatarId}`, {
        responseType: 'json'
      })
    )
  }
}

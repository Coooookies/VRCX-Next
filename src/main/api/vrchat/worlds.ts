import { attempt } from '@shared/utils/async'
import type { Got, Response, HTTPError } from 'got'
import type {
  ErrorResponse,
  FavoritedWorld,
  OrderOption,
  ReleaseStatus,
  SortOption,
  World
} from '@shared/definition/vrchat-api-response'

export class Worlds {
  private client: Got

  constructor(client: Got) {
    this.client = client.extend({
      responseType: 'json'
    })
  }

  getWorld(worldId: string) {
    return attempt<Response<World>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get(`worlds/${worldId}`, {
        responseType: 'json'
      })
    )
  }

  getFavoriteWorlds(
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
    return attempt<Response<FavoritedWorld>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get('worlds/favorites', {
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
}

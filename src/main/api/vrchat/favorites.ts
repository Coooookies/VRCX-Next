import { attempt } from '@shared/utils/async'
import type { Got, Response, HTTPError } from 'got'
import type {
  ErrorResponse,
  Favorite,
  FavoriteGroup,
  FavoriteLimits,
  FavoriteType,
  Success,
  UpdateFavoriteGroupRequest
} from '@shared/definition/vrchat-api-response'

export class Favorites {
  constructor(private client: Got) {}

  public getFavoriteGroups(
    offset: number,
    n: number,
    option: {
      userId?: string
      ownerId?: string
    } = {}
  ) {
    return attempt<Response<FavoriteGroup>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get('favorite/groups', {
        responseType: 'json',
        searchParams: {
          offset,
          n,
          userId: option.userId,
          ownerId: option.ownerId
        }
      })
    )
  }

  public updateFavoriteGroup(
    type: FavoriteType,
    name: string,
    userId: string,
    data: UpdateFavoriteGroupRequest
  ) {
    return attempt<Response<FavoriteGroup>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.put(`favorite/group/${type}/${encodeURIComponent(name)}/${userId}`, {
        responseType: 'json',
        json: data
      })
    )
  }

  public getFavorites(
    offset: number,
    n: number,
    option: {
      type?: FavoriteType
      tag?: string
    } = {}
  ) {
    return attempt<Response<Favorite[]>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get('favorites', {
        responseType: 'json',
        searchParams: {
          offset,
          n,
          type: option.type,
          tag: option.tag
        }
      })
    )
  }

  public getFavoriteLimits() {
    return attempt<Response<FavoriteLimits>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get('auth/user/favoritelimits', {
        responseType: 'json'
      })
    )
  }

  public clearFavoriteGroup(type: FavoriteType, name: string, userId: string) {
    return attempt<Response<Success>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.delete(`favorite/group/${type}/${encodeURIComponent(name)}/${userId}`, {
        responseType: 'json'
      })
    )
  }

  public removeFavorite(favoriteId: string) {
    return attempt<Response<Success>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.delete(`favorites/${favoriteId}`, {
        responseType: 'json'
      })
    )
  }

  public addFavorite(type: FavoriteType, targetId: string, tags: string[] = []) {
    return attempt<Response<Favorite>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.post('favorites', {
        responseType: 'json',
        json: {
          type: type,
          favoriteId: targetId,
          tags: tags
        }
      })
    )
  }
}

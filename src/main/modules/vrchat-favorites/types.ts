import type { FavoriteGroupSummary } from '@shared/definition/vrchat-favorites'

export interface FavoritedContainer<T> {
  items: T[]
  groups: Map<string, string[]>
}

export interface FavoritedGroupContainer {
  summary: FavoriteGroupSummary
  itemIds: string[]
}

import type { FriendRepository } from './repository'

export class FriendsFetcher {
  constructor(private readonly repository: FriendRepository) {}
}

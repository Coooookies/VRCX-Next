import type { LoggerFactory } from '@main/logger'
import type { VRChatAPI } from '../vrchat-api'
import type { MiscellaneousRepository } from './repository'

export class MiscellaneousFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly api: VRChatAPI,
    private readonly repository: MiscellaneousRepository
  ) {}

  public async fetchServerTime() {
    const result = await this.api.ref.publicAPI.miscellaneous.getServerTime()

    if (!result.success) {
      this.logger.error('Failed to fetch server time')
      this.repository.setServerTimeOffset(0)
      return
    }

    try {
      const serverTimeJson = JSON.parse(result.value.body)
      const serverTime = new Date(serverTimeJson)
      const offset = Date.now() - serverTime.getTime()

      this.logger.info(`Fetched server time: ${serverTime}, offset: ${offset}ms`)
      this.repository.setServerTimeOffset(offset)
    } catch (error) {
      this.logger.error('Failed to parse server time', error)
      this.repository.setServerTimeOffset(0)
    }
  }
}

import { Authentication } from './authentication'
import type { Got } from 'got'

export class VRChatAPI {
  public readonly client: Got
  public readonly authentication: Authentication

  constructor(got: Got) {
    this.client = got
    this.authentication = new Authentication(this.client)
  }
}

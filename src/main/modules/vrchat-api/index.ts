import { got } from 'got'
import { createLogger } from '@main/logger'
import { createHooks } from './create-hooks'
import { createProxyAgent } from './create-proxy-agent'
import { Dependency, Module } from '@shared/module-constructor'
import { VRChatAPI as API } from '@main/api'
import { VRCHAT_API_BASE_URL, VRCHAT_API_USER_AGENT } from './constants'
import type { Got, Response } from 'got'
import type { SettingModule } from '../setting'

export class VRChatAPI extends Module<{
  'response:unauthorized': (response: Response<unknown>) => void
  'response:bad-request': (response: Response<unknown>) => void
  'response:forbidden': (response: Response<unknown>) => void
  'response:not-found': (response: Response<unknown>) => void
  'response:rate-limit': (response: Response<unknown>) => void
  'response:server-error': (response: Response<unknown>) => void
}> {
  @Dependency('SettingModule') declare private setting: SettingModule

  private readonly logger = createLogger(this.moduleId)

  private publicClient!: Got
  private sessionClient!: Got
  private authToken: string | null = null
  private twoFactorToken: string | null = null

  protected async onInit(): Promise<void> {
    await this.updateClient()
  }

  private createClient() {
    const proxySetting = this.setting.resolveNamespace('network')
    const proxyConfig = {
      enabled: proxySetting.proxy_enabled,
      type: proxySetting.proxy_type,
      host: proxySetting.proxy_host,
      port: proxySetting.proxy_port,
      username: proxySetting.proxy_credential_username,
      password: proxySetting.proxy_credential_password
    }

    const agent = createProxyAgent(proxyConfig)
    const hooks = createHooks({
      // onRequest: (req) => this.logger.debug('Request:', req.method, req.url),
      onResponse: (res) => this.logger.trace('Response:', res.url, res.statusCode),
      onRetry: (error, count) => this.logger.warn('Retry:', error.message, 'Count:', count),
      onUnauthorized: (res) => this.emit('response:unauthorized', res),
      onBadRequest: (res) => this.emit('response:bad-request', res),
      onForbidden: (res) => this.emit('response:forbidden', res),
      onNotFound: (res) => this.emit('response:not-found', res),
      onRateLimit: (res) => this.emit('response:rate-limit', res),
      onServerError: (res) => this.emit('response:server-error', res)
    })

    let cookie = ''
    this.authToken && (cookie += `auth=${this.authToken};`)
    this.twoFactorToken && (cookie += `twoFactorAuth=${this.twoFactorToken}`)

    const commonOptions = {
      prefixUrl: VRCHAT_API_BASE_URL,
      agent,
      hooks,
      retry: { limit: 3, noise: 100 }
    }

    const publicClient = got.extend({
      ...commonOptions,
      headers: {
        'User-Agent': VRCHAT_API_USER_AGENT
      }
    })

    const sessionClient = got.extend({
      ...commonOptions,
      headers: {
        'User-Agent': VRCHAT_API_USER_AGENT,
        Cookie: cookie
      }
    })

    return {
      publicClient,
      sessionClient
    }
  }

  private updateClient() {
    const { publicClient, sessionClient } = this.createClient()
    this.publicClient = publicClient
    this.sessionClient = sessionClient
  }

  public async setToken(authToken?: string, twoFactorToken?: string) {
    this.authToken = authToken || null
    this.twoFactorToken = twoFactorToken || null
    this.updateClient()
  }

  public get ref() {
    return {
      publicAPI: new API(this.publicClient),
      sessionAPI: new API(this.sessionClient)
    }
  }
}

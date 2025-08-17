import WebSocket from 'ws'
import { createLogger } from '@main/logger'
import { createProxyAgent } from './create-proxy-agent'
import { Dependency, Module } from '@shared/module-constructor'
import { MAX_RECONNECT_ATTEMPTS } from './constants'
import { VRCHAT_API_USER_AGENT, VRCHAT_PIPELINE_ADDRESS } from '../vrchat-api/constants'
import type { SettingModule } from '../setting'
import type { PipelineEventMessage, PipelineEvents } from '@shared/definition/vrchat-pipeline'
import type { VRChatWorkflowCoordinator } from '../vrchat-workflow-coordinator'
import type { VRChatAuthentication } from '../vrchat-authentication'

export class VRChatPipeline extends Module<{
  message: (message: PipelineEventMessage) => void
}> {
  @Dependency('VRChatAuthentication') declare private auth: VRChatAuthentication
  @Dependency('VRChatWorkflowCoordinator') declare private workflow: VRChatWorkflowCoordinator
  @Dependency('SettingModule') declare private setting: SettingModule

  private readonly logger = createLogger(this.moduleId)

  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = MAX_RECONNECT_ATTEMPTS
  private reconnectPending = false
  private reconnectTimeout: NodeJS.Timeout | null = null
  private isConnecting = false
  private shouldReconnect = false
  private cachedPipelineEvents: PipelineEventMessage[] = []
  private cacheEnabled = false

  protected onInit(): void {
    this.bindEvents()
  }

  protected onDestroy(): void {
    this.disconnect()
  }

  private bindEvents() {
    this.workflow.registerPostLoginTask('pipeline-connect', 20, () => {
      this.shouldReconnect = true
      this.connect()
    })

    this.workflow.registerPostLogoutTask('pipeline-disconnect', 20, () => {
      this.shouldReconnect = false
      this.disconnect()
    })

    this.workflow.on('workflow:start', () => {
      this.cachedPipelineEvents = []
      this.cacheEnabled = true
    })

    this.workflow.on('workflow:complete', () => {
      this.cacheEnabled = false
    })

    this.workflow.on('workflow:interrupted', () => {
      this.cacheEnabled = false
    })

    this.on('message', (message) => {
      this.logger.debug('pipeline-message', JSON.stringify(message, null, 2))

      if (this.cacheEnabled) {
        this.cachedPipelineEvents.push(message)
      }
    })
  }

  private createClient() {
    const state = this.auth.currentState
    const proxySetting = this.setting.resolveNamespace('network')
    const proxyConfig = {
      state: proxySetting.proxy_state,
      type: proxySetting.proxy_type,
      host: proxySetting.proxy_host,
      port: proxySetting.proxy_port,
      username: proxySetting.proxy_credential_username,
      password: proxySetting.proxy_credential_password
    }

    const token = state.type === 'authenticated' ? state.authToken : ''
    const address = `${VRCHAT_PIPELINE_ADDRESS}/?auth=${token}`
    const agent = createProxyAgent(proxyConfig)
    const headers = {
      'User-Agent': VRCHAT_API_USER_AGENT
    }

    return new WebSocket(address, {
      headers,
      agent
    })
  }

  private connect() {
    if (
      this.isConnecting ||
      this.ws?.readyState === WebSocket.OPEN ||
      this.auth.currentState.type !== 'authenticated'
    ) {
      this.logger.warn('Already connecting or connected, or not authenticated.')
      return
    }

    this.logger.info('Connecting to VRChat Pipeline...')

    try {
      this.isConnecting = true
      this.ws = this.createClient()

      this.ws.on('open', () => {
        this.logger.info('Socket connected')
        this.isConnecting = false
        this.reconnectAttempts = 0
      })

      this.ws.on('message', (data) => {
        this.handleMessage(data)
      })

      this.ws.on('close', (code, reason) => {
        if (this.reconnectPending) {
          return
        }

        this.logger.warn(`Socket closed (code:${code},reason:${reason.toString()})`)
        this.isConnecting = false
        this.ws = null

        if (this.shouldReconnect) {
          this.scheduleReconnect()
        }
      })

      this.ws.on('error', (error) => {
        if (this.reconnectPending) {
          return
        }

        this.logger.error('Socket error:', error)
        this.isConnecting = false

        if (this.ws) {
          this.ws = null
        }

        if (this.shouldReconnect) {
          this.scheduleReconnect()
        }
      })
    } catch (error) {
      this.logger.error('Socket connection failed:', error)
      this.isConnecting = false

      if (this.shouldReconnect) {
        this.scheduleReconnect()
      }
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.logger.error(`Reached maximum reconnect attempts. Giving up.`)
      this.auth.signout()
      return
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000)

    this.reconnectPending = true
    this.reconnectAttempts++
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null
      this.reconnectPending = false
      if (this.shouldReconnect) {
        this.connect()
      }
    }, delay)

    this.logger.warn(`Socket will reconnect in ${delay}ms (Attempt ${this.reconnectAttempts})`)
  }

  private disconnect() {
    this.shouldReconnect = false
    this.reconnectAttempts = 0

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.ws) {
      this.logger.info('Disconnecting...')
      this.ws.close()
      this.ws = null
    }
  }

  private handleMessage(data: WebSocket.RawData) {
    try {
      const message: {
        type: PipelineEvents
        content: string
      } = JSON.parse(data.toString())

      if (message.content.length === 0) {
        return
      }

      const parsedMessage = {
        type: message.type,
        content: JSON.parse(message.content)
      } as PipelineEventMessage

      this.emit('message', parsedMessage)
    } catch (error) {
      this.logger.error('Failed to parse message:', error)
    }
  }

  public get cachedEvents() {
    return this.cachedPipelineEvents
  }
}

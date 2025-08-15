import { protocol } from 'electron'
import { createLogger } from '@main/logger'
import { extractPathParameters } from '@main/utils/path'
import { Module } from '@shared/module-constructor'
import { APP_PROTOCOL } from '@main/constants'
import type { ProtocolEventInstance, ProtocolHandler } from './types'
import type { ExtractParams } from '@shared/definition/utils'

export class ProtocolServer extends Module {
  private readonly protocolHandlers = new Map<symbol, ProtocolEventInstance>()
  private readonly logger = createLogger(this.moduleId)

  private logProtocolEvent = (
    option:
      | {
          type: 'REQUEST'
          method: string
          hostname: string
          path: string
        }
      | {
          type: 'RESPONSE'
          method: string
          hostname: string
          path: string
          status: number
          delay: number
        }
  ): void => {
    switch (option.type) {
      case 'REQUEST':
        this.logger.debug('<--', option.method, option.hostname, option.path)
        break
      case 'RESPONSE':
        this.logger.debug(
          '-->',
          option.method,
          option.hostname,
          option.path,
          option.status,
          `${option.delay}ms`
        )
        break
    }
  }

  public register<P extends string>(
    hostname: string,
    path: P,
    method: string,
    handler: ProtocolHandler<ExtractParams<P>>
  ): symbol {
    const symbol = Symbol()
    this.protocolHandlers.set(symbol, {
      hostname,
      path,
      method: method.toUpperCase(),
      handler: handler as ProtocolHandler
    })

    return symbol
  }

  public unregister(symbol: symbol): void {
    this.protocolHandlers.delete(symbol)
  }

  public bindProtocolHandler(instance: Electron.Session): void {
    instance.protocol.handle(APP_PROTOCOL, (request) => {
      const url = new URL(request.url)
      const hostname = url.hostname
      const path = url.pathname
      const method = request.method.toUpperCase()
      const startTime = Date.now()

      this.logProtocolEvent({
        type: 'REQUEST',
        method,
        hostname,
        path
      })

      const interceptor = [...this.protocolHandlers.values()].find((proxy) => {
        return (
          proxy.hostname === hostname &&
          proxy.method === method &&
          extractPathParameters(proxy.path, path) !== null
        )
      })

      if (!interceptor) {
        this.logProtocolEvent({
          type: 'RESPONSE',
          method,
          hostname,
          path,
          status: 404,
          delay: Date.now() - startTime
        })
        return new Response('404 Not Found', {
          status: 404,
          statusText: 'Not Found'
        })
      }

      const params = extractPathParameters(interceptor.path, path)!
      const result = interceptor.handler(request, params)

      if (result instanceof Promise) {
        result
          .then((response) => {
            this.logProtocolEvent({
              type: 'RESPONSE',
              method,
              hostname,
              path,
              status: response.status,
              delay: Date.now() - startTime
            })
          })
          .catch(() => {})
      } else {
        this.logProtocolEvent({
          type: 'RESPONSE',
          method,
          hostname,
          path,
          status: result.status,
          delay: Date.now() - startTime
        })
      }

      return result
    })
  }

  public unbindProtocolHandler(instance: Electron.Session): void {
    instance.protocol.unhandle(APP_PROTOCOL)
  }

  static registerProtocol(): void {
    protocol.registerSchemesAsPrivileged([
      {
        scheme: APP_PROTOCOL,
        privileges: {
          secure: true,
          standard: true,
          corsEnabled: true,
          supportFetchAPI: true
        }
      }
    ])
  }
}

import { HttpProxyAgent, HttpsProxyAgent } from 'hpagent'
import { SocksProxyAgent } from 'socks-proxy-agent'
import type { HttpsProxyAgentOptions } from 'hpagent'
import type { OptionsOfTextResponseBody } from 'got'
import type { ProxyState, ProxyType } from '@shared/types/setting'

export function createProxyAgent(config: {
  state: ProxyState
  type: ProxyType
  host: string
  port: number
  username?: string
  password?: string
}): OptionsOfTextResponseBody['agent'] {
  if (config.state !== 'custom_proxy') {
    return {}
  }

  const { type, host, port, username, password } = config
  const _address = `${host}:${port}`
  const _username = encodeURIComponent(username || '')
  const _password = encodeURIComponent(password || '')
  const _credential = username && password ? `${_username}:${_password}@` : ''

  switch (type) {
    case 'socks': {
      const proxy = new SocksProxyAgent(`socks://${_credential}${_address}`)
      return {
        http: proxy,
        https: proxy
      }
    }
    case 'http': {
      const options: HttpsProxyAgentOptions = {
        keepAlive: true,
        keepAliveMsecs: 1000,
        maxSockets: 256,
        maxFreeSockets: 256,
        scheduling: 'lifo',
        proxy: `http://${_credential}${_address}`
      }

      return {
        http: new HttpProxyAgent(options),
        https: new HttpsProxyAgent(options)
      }
    }
  }
}

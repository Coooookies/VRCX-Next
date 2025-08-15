import { HttpProxyAgent } from 'hpagent'
import { SocksProxyAgent } from 'socks-proxy-agent'
import type { ProxyState, ProxyType } from '@shared/definition/setting'

export function createProxyAgent(config: {
  state: ProxyState
  type: ProxyType
  host: string
  port: number
  username?: string
  password?: string
}): HttpProxyAgent | SocksProxyAgent | undefined {
  if (config.state !== 'custom_proxy') {
    return undefined
  }

  const { type, host, port, username, password } = config
  const _address = `${host}:${port}`
  const _username = encodeURIComponent(username || '')
  const _password = encodeURIComponent(password || '')
  const _credential = username && password ? `${_username}:${_password}@` : ''

  switch (type) {
    case 'socks': {
      return new SocksProxyAgent(`socks://${_credential}${_address}`)
    }
    case 'http': {
      return new HttpProxyAgent({
        keepAlive: true,
        keepAliveMsecs: 1000,
        maxSockets: 256,
        maxFreeSockets: 256,
        scheduling: 'lifo',
        proxy: `http://${_credential}${_address}`
      })
    }
  }
}

import { HttpProxyAgent, HttpsProxyAgent } from 'hpagent'
import { SocksProxyAgent } from 'socks-proxy-agent'
import type { HttpsProxyAgentOptions } from 'hpagent'
import type { OptionsOfTextResponseBody } from 'got'

export function createProxyAgent(config: {
  enabled: boolean
  type: 'http' | 'https' | 'socks'
  host: string
  port: number
  username?: string
  password?: string
}): OptionsOfTextResponseBody['agent'] {
  if (!config.enabled) {
    return {}
  }

  const { type, host, port, username, password } = config
  const _address = `${host}:${port}`
  const _username = encodeURIComponent(username || '')
  const _password = encodeURIComponent(password || '')
  const _credential = username && password ? `${_username}:${_password}@` : ''
  const proxyUrl = `${type}://${_credential}${_address}`

  const options: HttpsProxyAgentOptions = {
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 256,
    maxFreeSockets: 256,
    scheduling: 'lifo',
    proxy: proxyUrl
  }

  switch (type) {
    case 'socks': {
      const proxy = new SocksProxyAgent(proxyUrl)
      return {
        http: proxy,
        https: proxy
      }
    }
    case 'http': {
      return {
        http: new HttpProxyAgent(options)
      }
    }
    case 'https': {
      return {
        https: new HttpsProxyAgent(options)
      }
    }
  }
}

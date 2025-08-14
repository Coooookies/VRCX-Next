import { z } from 'zod'
const proxyTypeEnum = ['http', 'socks'] as const

export const NETWORK_PROXY_SCHEMA = z.discriminatedUnion('state', [
  z.object({
    state: z.literal('disabled'),
    type: z.enum(proxyTypeEnum).optional(),
    host: z.string().optional(),
    port: z.number().optional(),
    credential_username: z.string().optional(),
    credential_password: z.string().optional()
  }),
  z.object({
    state: z.literal('system_proxy'),
    type: z.enum(proxyTypeEnum).optional(),
    host: z.string().optional(),
    port: z.number().optional(),
    credential_username: z.string().optional(),
    credential_password: z.string().optional()
  }),
  z.object({
    state: z.literal('custom_proxy'),
    type: z.enum(proxyTypeEnum),
    host: z.string().min(1, 'setting.network.proxy_host_not_empty'),
    port: z
      .number()
      .min(1, 'setting.network.proxy_port_invaild')
      .max(65535, 'setting.network.proxy_port_invaild'),
    credential_username: z.string().optional(),
    credential_password: z.string().optional()
  })
])

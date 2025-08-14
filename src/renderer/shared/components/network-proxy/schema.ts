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
    host: z.string().min(1, 'Host cannot be empty.'),
    port: z.number().min(1, 'Must in 1~65535').max(65535, 'Must in 1~65535'),
    credential_username: z.string().optional(),
    credential_password: z.string().optional()
  })
])

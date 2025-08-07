export type ProtocolHandler<T extends Record<string, string> = {}> = (
  request: Request,
  params: T
) => Response | Promise<Response>

export type ProtocolEventInstance<T extends Record<string, string> = {}> = {
  hostname: string
  path: string
  method: string
  handler: ProtocolHandler<T>
}

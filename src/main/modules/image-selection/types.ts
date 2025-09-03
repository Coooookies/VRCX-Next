import type { PassThrough } from 'node:stream'

export interface ImageSelectionDialogReturnValue {
  path: string
  bookmark: string | null
}

export type SelectionResolver = {
  mime: string
  buffer: () => Promise<Buffer<ArrayBufferLike>>
  stream: () => PassThrough
}

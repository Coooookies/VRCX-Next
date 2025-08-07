import type { Dirent, ReadStream } from 'node:fs'

export type DirentResolver = {
  dirent: Dirent
  mime: string
  buffer: () => Promise<Buffer<ArrayBufferLike>>
  stream: () => ReadStream
}

import { join, relative, basename } from 'node:path'
import { open, access, readdir, stat } from 'node:fs/promises'
import { toUrl } from './path'
import { File } from 'buffer'
import type { Dirent, ReadStream } from 'node:fs'
import type { Readable } from 'node:stream'

export interface ReverseReadOptions {
  maxLines?: number
  encoding?: BufferEncoding
  filter?: (line: string, stopSignal: ReverseReadStopSignal) => boolean
}

export interface ReverseReadStopSignal {
  stopped: boolean
  includeLine: boolean
  stop(includeLine?: boolean): void
}

export async function exists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export async function readSubDirectories(path: string): Promise<Dirent[]> {
  const entries = await readdir(path, { withFileTypes: true })
  const directories = entries.filter((entry) => entry.isDirectory())
  return directories
}

export async function readSubFiles(path: string): Promise<Dirent[]> {
  const entries = await readdir(path, { withFileTypes: true })
  const files = entries.filter((entry) => entry.isFile())
  return files
}

export async function readFullSubDirents(path: string): Promise<Map<string, Dirent>> {
  const rootPath = path
  const dirents = new Map<string, Dirent>()

  const set = async (path: string, dirent: Dirent) => {
    const relativePath = relative(rootPath, path)
    const normalizedPath = toUrl(relativePath)
    dirents.set(normalizedPath, dirent)
  }

  const next = async (path: string): Promise<Map<string, Dirent>> => {
    const entries = await readdir(path, { withFileTypes: true })

    for (const entry of entries) {
      const entryPath = join(path, entry.name)
      if (entry.isDirectory()) await next(entryPath)
      else if (entry.isFile()) await set(entryPath, entry)
    }

    return dirents
  }

  return next(path)
}

export async function readLinesReverse(
  filePath: string,
  options: ReverseReadOptions = {}
): Promise<string[]> {
  const { filter = () => true, maxLines = Infinity, encoding = 'utf8' } = options
  const createStopSignal = (): ReverseReadStopSignal => {
    const signal = {
      stopped: false,
      includeLine: false,
      stop(includeLine: boolean = false) {
        signal.stopped = true
        signal.includeLine = includeLine
      }
    }
    return signal
  }

  const fileStat = await stat(filePath)
  const fileSize = fileStat.size
  if (fileSize === 0) {
    return []
  }

  const stopSignal = createStopSignal()
  const file = await open(filePath, 'r')
  const lines: string[] = []

  let leftover = ''
  let position = fileSize
  const chunkSize = 16 * 1024

  try {
    while (position > 0 && lines.length < maxLines && !stopSignal.stopped) {
      const readSize = Math.min(chunkSize, position)
      position -= readSize

      const chunk = Buffer.alloc(readSize)
      await file.read(chunk, 0, readSize, position)

      const currentBuffer = chunk.toString(encoding) + leftover
      const parts = currentBuffer.split('\n')
      leftover = parts.shift() || ''

      for (let i = parts.length - 1; i >= 0; i--) {
        const line = parts[i].replace(/\r$/, '')
        const shouldInclude = filter(line, stopSignal)

        if (stopSignal.stopped) {
          if (stopSignal.includeLine && !shouldInclude) {
            lines.push(line)
          }
          break
        }

        if (shouldInclude) {
          lines.push(line)
        }

        if (lines.length >= maxLines) {
          break
        }
      }
    }

    if (leftover && lines.length < maxLines && !stopSignal.stopped) {
      const shouldInclude = filter(leftover, stopSignal)
      if (stopSignal.stopped) {
        if (stopSignal.includeLine && !shouldInclude) {
          lines.push(leftover)
        }
      } else if (shouldInclude) {
        lines.push(leftover)
      }
    }
  } finally {
    await file.close()
  }

  return lines
}

export const toReadableStream = (stream: ReadStream | Readable) => {
  return new ReadableStream({
    start(controller): void {
      stream.on('data', (chunk) => controller.enqueue(chunk))
      stream.on('end', () => controller.close())
      stream.on('error', (err) => controller.error(err))
    },
    cancel(): void {
      stream.destroy()
    }
  })
}

export async function createStreamableFile(path: string): Promise<File> {
  const name = basename(path)
  const handle = await open(path)
  const { size } = await handle.stat()

  const file = new File([], name)
  file.stream = () => handle.readableWebStream()

  Object.defineProperty(file, 'size', { get: () => size })
  return file
}

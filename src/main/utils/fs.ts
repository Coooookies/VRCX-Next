import { join, relative } from 'node:path'
import { access, readdir } from 'node:fs/promises'
import { toUrl } from './path'
import type { Dirent, ReadStream } from 'node:fs'
import type { Readable } from 'node:stream'

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

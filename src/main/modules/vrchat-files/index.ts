import { basename, extname, join } from 'node:path'
import { PassThrough } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { readFile } from 'node:fs/promises'
import { getExtension, getMimeType } from 'hono/utils/mime'
import { createLogger } from '@main/logger'
import { readSubFiles, toReadableStream } from '@main/utils/fs'
import { Dependency, Module } from '@shared/module-constructor'
import { APP_CACHE_DIR } from '@main/constants'
import { mkdirSync, existsSync, createWriteStream, createReadStream } from 'node:fs'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatAuthentication } from '../vrchat-authentication'
import type { ProtocolServer } from '../protocol-server'
import type { DirentResolver } from './types'
import type { Response } from 'got'

const CACHE_VRCHAT_IMAGE_DIR = 'vrchat/images'

export class VRChatFiles extends Module<{}> {
  @Dependency('ProtocolServer') declare private protocol: ProtocolServer
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatAuthentication') declare private auth: VRChatAuthentication

  private readonly imageCacheDir = join(APP_CACHE_DIR, CACHE_VRCHAT_IMAGE_DIR)
  private readonly logger = createLogger(this.moduleId)
  // private readonly client = got.extend({
  //   prefixUrl: VRCHAT_API_BASE_URL,
  //   headers: {
  //     'User-Agent': VRCHAT_API_USER_AGENT
  //   }
  // })

  protected onInit(): void {
    if (!existsSync(this.imageCacheDir)) {
      mkdirSync(this.imageCacheDir, { recursive: true })
    }

    this.bindProtocolEvents()
  }

  private async resolveLocalImageCache(
    fileId: string,
    version: number,
    size: number
  ): Promise<DirentResolver | null> {
    const targetDir = join(this.imageCacheDir, `${fileId}/${version}`)

    if (!existsSync(targetDir)) {
      return null
    }

    const fileDirents = await readSubFiles(targetDir)

    for (const dirent of fileDirents) {
      const ext = extname(dirent.name)
      const name = basename(dirent.name, ext)
      const mime = getMimeType(dirent.name) || 'text/plain'

      if (name === String(size)) {
        const path = join(targetDir, dirent.name)
        return {
          dirent,
          mime,
          buffer: () => readFile(path),
          stream: () => createReadStream(path)
        }
      }
    }

    return null
  }

  private async saveImageToCache(
    fileId: string,
    version: number,
    size: number,
    mime: string,
    stream: PassThrough
  ): Promise<void> {
    const targetDir = join(this.imageCacheDir, `${fileId}/${version}`)
    const ext = getExtension(mime) || 'cache'

    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true })
    }

    const filePath = join(targetDir, `${size}.${ext}`)
    const fileStream = createWriteStream(filePath)
    return pipeline(stream, fileStream)
  }

  private bindProtocolEvents(): void {
    const createNotFoundResponse = () => {
      return new Response(null, { status: 404 })
    }

    this.protocol.register<{
      fileId: string
      version: string
      size: string
    }>('vrchat-proxy', '/image/:fileId/:version/:size', 'GET', async (_, params) => {
      const fileId = params.fileId
      const version = +params.version
      const size = +params.size
      const localCache = await this.resolveLocalImageCache(fileId, version, size)

      this.logger.debug(
        'File request:',
        `fileId:${fileId} | version:${version} | size:${size} | cache:${!!localCache}`
      )

      if (localCache) {
        try {
          const { stream, mime } = localCache
          return new Response(toReadableStream(stream()), {
            status: 200,
            headers: {
              'Content-Type': mime,
              'Cache-Control': 'max-age=86400'
            }
          })
        } catch (error) {
          this.logger.error(
            'Failed to fetch image:',
            error instanceof Error ? error.message : String(error)
          )
          return createNotFoundResponse()
        }
      }

      try {
        const url = `image/${fileId}/${version}/${size}`
        const response = this.api.ref.publicAPI.client.stream(url)
        const gotResponse = await new Promise<Response>((resolve, reject) => {
          response.once('response', resolve)
          response.once('error', reject)
        })

        const mime = gotResponse.headers['content-type'] || 'application/octet-stream'
        const tee1 = new PassThrough()
        const tee2 = new PassThrough()
        response.pipe(tee1)
        response.pipe(tee2)

        const readableStream = toReadableStream(tee2)
        await this.saveImageToCache(fileId, version, size, mime, tee1)

        return new Response(readableStream, {
          status: 200,
          headers: {
            'Content-Type': mime,
            'Cache-Control': 'max-age=86400'
          }
        })
      } catch (error) {
        this.logger.error(
          'Failed to fetch image:',
          error instanceof Error ? error.message : String(error)
        )
        return createNotFoundResponse()
      }
    })
  }
}

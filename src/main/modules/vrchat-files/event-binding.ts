import { PassThrough } from 'node:stream'
import { toReadableStream } from '@main/utils/fs'
import type { LoggerFactory } from '@main/logger'
import type { ProtocolServer } from '../protocol-server'
import type { FilesRepository } from './repository'
import type { FilesFetcher } from './fetcher'
import type { Response } from 'got'

export class FilesEventBinding {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly protocol: ProtocolServer,
    private readonly fetcher: FilesFetcher,
    private readonly repository: FilesRepository
  ) {}

  public bindProtocolEvents(): void {
    const createNotFoundResponse = () => {
      return new Response(null, { status: 404 })
    }

    this.protocol.register(
      'vrchat-proxy',
      '/image/:fileId/:version/:size',
      'GET',
      async (_, params) => {
        const fileId = params.fileId
        const version = +params.version
        const size = +params.size
        const localCache = await this.repository.resolveLocalImageCache(fileId, version, size)

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
          const response = this.fetcher.fetchImageStream(fileId, version, size)
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
          await this.repository.saveImageToCache(fileId, version, size, mime, tee1)

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
      }
    )
  }
}

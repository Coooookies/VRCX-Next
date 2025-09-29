import { toReadableStream } from '@main/utils/fs'
import type { LoggerFactory } from '@main/logger'
import type { ProtocolServer } from '../protocol-server'
import type { ImageSelectionRepository } from './repository'

export class ImageSelectionEventBinding {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly protocol: ProtocolServer,
    private readonly repository: ImageSelectionRepository
  ) {
    this.bindProtocolEvents()
  }

  private bindProtocolEvents(): void {
    const createNotFoundResponse = () => {
      return new Response(null, { status: 404 })
    }

    this.protocol.register(
      'image-selection-proxy',
      '/image/:selectionId/:size',
      'GET',
      async (_, params) => {
        const size = +params.size
        const selectionId = params.selectionId
        const localCache = await this.repository.resolveLocalImageThumbnailCache(selectionId, size)

        this.logger.debug(
          'Overview request:',
          `selectionId:${selectionId} | size:${size} | cache:${!!localCache}`
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

        const response = await this.repository.resolveLocalImageThumbnail(selectionId, size)
        if (!response) {
          return createNotFoundResponse()
        }

        const stream = response.stream()
        const readableStream = toReadableStream(stream)
        await this.repository.saveImageToCache(selectionId, size, response.mime, stream)

        return new Response(readableStream, {
          status: 200,
          headers: {
            'Content-Type': response.mime,
            'Cache-Control': 'max-age=86400'
          }
        })
      }
    )
  }
}

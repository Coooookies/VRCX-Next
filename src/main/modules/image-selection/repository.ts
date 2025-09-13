import { basename, extname, join } from 'node:path'
import { getExtension, getMimeType } from 'hono/utils/mime'
import { exists, readSubFiles } from '@main/utils/fs'
import { mkdir, readFile } from 'node:fs/promises'
import { attempt } from '@shared/utils/async'
import { pipeline } from 'node:stream/promises'
import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'node:fs'
import { resizeToMinEdge } from './factory'
import { PassThrough } from 'node:stream'
import { Database } from '../database'
import { ImageSelectionEntity } from '../database/entities/selection-images'
import { APP_CACHE_DIR } from '@main/constants'
import { CACHE_THUMBNAIL_FORMAT, CACHE_THUMBNAIL_MIMETYPE } from './constants'
import type { LoggerFactory } from '@main/logger'
import type { Repository } from 'typeorm'
import type { ImageSelectionInstance } from '@shared/definition/image-selection'
import type { DirentResolver } from '../vrchat-files/types'
import type { SelectionResolver } from './types'

const CACHE_IMAGE_SELECTION_DIR = 'image-selection/images'

export class ImageSelectionRepository {
  private readonly imageCacheDir = join(APP_CACHE_DIR, CACHE_IMAGE_SELECTION_DIR)

  constructor(
    private logger: LoggerFactory,
    private database: Database
  ) {
    if (!existsSync(this.imageCacheDir)) {
      mkdirSync(this.imageCacheDir, { recursive: true })
    }
  }

  public get repository(): Repository<ImageSelectionEntity> {
    return this.database.source.getRepository(ImageSelectionEntity)
  }

  public upsertSelections(entities: ImageSelectionEntity[]) {
    return this.repository.upsert(entities, {
      conflictPaths: ['selectionId'],
      skipUpdateIfNoValuesChanged: true
    })
  }

  public async getSelection(selectionId: string) {
    return this.repository.findOneBy({ selectionId })
  }

  public async resolveImageSelection(selectionId: string): Promise<ImageSelectionInstance | null> {
    const result = await this.getSelection(selectionId)

    if (!result) {
      return null
    }

    return {
      selectionId: result.selectionId,
      fileName: result.fileName,
      fileExtension: result.fileExtension,
      exist: await exists(result.path),
      recordedAt: result.recordedAt!
    }
  }

  public resolveLatestImageSelections(limit: number): Promise<ImageSelectionInstance[]> {
    return this.repository
      .find({
        order: { recordedAt: 'DESC' },
        take: limit
      })
      .then((results) =>
        results.map(async (result) => {
          const exist = await exists(result.path)
          return {
            selectionId: result.selectionId,
            fileName: result.fileName,
            fileExtension: result.fileExtension,
            exist,
            recordedAt: result.recordedAt!
          }
        })
      )
      .then((promises) => Promise.all(promises))
  }

  public async resolveLocalImageThumbnailCache(
    selectionId: string,
    size: number
  ): Promise<DirentResolver | null> {
    const targetDir = join(this.imageCacheDir, selectionId)

    if (!(await exists(targetDir))) {
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

  public async resolveLocalImageThumbnail(
    selectionId: string,
    size: number
  ): Promise<SelectionResolver | null> {
    const selection = await this.getSelection(selectionId)
    const mime = CACHE_THUMBNAIL_MIMETYPE
    const format = CACHE_THUMBNAIL_FORMAT

    if (!selection || !(await exists(selection.path))) {
      return null
    }

    const processed = await attempt(() => resizeToMinEdge(selection.path, size))
    if (!processed.success) {
      this.logger.error('Failed to process selection overview', selectionId, processed.error)
      return null
    }

    const result = attempt(() => processed.value.toFormat(format))
    if (!result.success) {
      this.logger.error('Failed to process selection overview', selectionId, result.error)
      return null
    }

    return {
      mime: mime,
      buffer: () => result.value.toBuffer(),
      stream: () => {
        const tee1 = new PassThrough()
        result.value.pipe(tee1)
        return tee1
      }
    }
  }

  public async saveImageToCache(
    selectionId: string,
    size: number,
    mime: string,
    stream: PassThrough
  ): Promise<void> {
    const targetDir = join(this.imageCacheDir, selectionId)
    const ext = getExtension(mime) || 'cache'

    if (!(await exists(targetDir))) {
      await mkdir(targetDir, { recursive: true })
    }

    const filePath = join(targetDir, `${size}.${ext}`)
    const fileStream = createWriteStream(filePath)
    return pipeline(stream, fileStream)
  }
}

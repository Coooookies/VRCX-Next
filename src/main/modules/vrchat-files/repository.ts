import { basename, extname, join } from 'node:path'
import { PassThrough } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { mkdir, readFile } from 'node:fs/promises'
import { getExtension, getMimeType } from 'hono/utils/mime'
import { exists, readSubFiles } from '@main/utils/fs'
import { APP_CACHE_DIR } from '@main/constants'
import { mkdirSync, existsSync, createWriteStream, createReadStream } from 'node:fs'
import { DirentResolver } from './types'
import { FileAnalysisEntity } from '../database/entities/vrchat-cache-analysis-files'
import type { FileUrlParsedResult } from '@shared/definition/vrchat-files'
import type { Repository } from 'typeorm'
import type { Database } from '../database'

const CACHE_VRCHAT_IMAGE_DIR = 'vrchat/images'

export class FilesRepository {
  private readonly imageCacheDir = join(APP_CACHE_DIR, CACHE_VRCHAT_IMAGE_DIR)

  public get repository(): Repository<FileAnalysisEntity> {
    return this.database.source.getRepository(FileAnalysisEntity)
  }

  constructor(private readonly database: Database) {
    if (!existsSync(this.imageCacheDir)) {
      mkdirSync(this.imageCacheDir, { recursive: true })
    }
  }

  public async resolveLocalImageCache(
    fileId: string,
    version: number,
    size: number
  ): Promise<DirentResolver | null> {
    const targetDir = join(this.imageCacheDir, `${fileId}/${version}`)

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

  public async saveImageToCache(
    fileId: string,
    version: number,
    size: number,
    mime: string,
    stream: PassThrough
  ): Promise<void> {
    const targetDir = join(this.imageCacheDir, `${fileId}/${version}`)
    const ext = getExtension(mime) || 'cache'

    if (!(await exists(targetDir))) {
      await mkdir(targetDir, { recursive: true })
    }

    const filePath = join(targetDir, `${size}.${ext}`)
    const fileStream = createWriteStream(filePath)
    return pipeline(stream, fileStream)
  }

  public async getSavedEntities(file: FileUrlParsedResult): Promise<FileAnalysisEntity | null>
  public async getSavedEntities(
    files: FileUrlParsedResult[]
  ): Promise<Map<string, FileAnalysisEntity>>
  public async getSavedEntities(
    files: FileUrlParsedResult | FileUrlParsedResult[]
  ): Promise<FileAnalysisEntity | Map<string, FileAnalysisEntity> | null> {
    const pendingFiles = Array.isArray(files) ? files : [files]
    const savedEntities = await this.repository.find({
      where: pendingFiles.map((file) => ({ fileId: file.fileId, fileVersion: file.version }))
    })

    if (Array.isArray(files)) {
      const entityMap = new Map<string, FileAnalysisEntity>()
      for (const entity of savedEntities) {
        entityMap.set(`${entity.fileId}-${entity.fileVersion}`, entity)
      }
      return entityMap
    } else {
      return savedEntities.length > 0 ? savedEntities[0] : null
    }
  }

  public async saveEntities(entities: FileAnalysisEntity | FileAnalysisEntity[]) {
    const entitiesArr = Array.isArray(entities) ? entities : [entities]
    return this.repository.upsert(entitiesArr, {
      conflictPaths: ['fileId', 'fileVersion'],
      skipUpdateIfNoValuesChanged: true
    })
  }
}

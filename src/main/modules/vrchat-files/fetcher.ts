import type { LoggerFactory } from '@main/logger'
import type { Request } from 'got'
import type { VRChatAPI } from '../vrchat-api'
import type { FilesRepository } from './repository'
import type { FileAnalysisEntity } from '../database/entities/vrchat-cache-analysis-file'
import type { FileAnalysisResult } from './types'
import type { FileUrlParsedResult } from '@shared/definition/vrchat-files'
import { limitedAllSettled } from '@shared/utils/async'
import { toFileAnalysisEntity } from './factory'
import {
  SAVED_FILE_ANALYSIS_ENTITY_EXPIRE_DELAY,
  FILE_ANALYSIS_ENTITIES_QUERY_THREAD_SIZE
} from './constants'
export class FilesFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly api: VRChatAPI,
    private readonly repository: FilesRepository
  ) {}

  public fetchImageStream(fileId: string, version: number, size: number): Request {
    const url = `image/${fileId}/${version}/${size}`
    const response = this.api.ref.publicAPI.client.stream(url)
    return response
  }

  public async fetchFileAnalysis(file: FileUrlParsedResult): Promise<FileAnalysisResult | null>
  public async fetchFileAnalysis(
    files: FileUrlParsedResult[]
  ): Promise<Map<string, FileAnalysisResult>>
  public async fetchFileAnalysis(
    files: FileUrlParsedResult | FileUrlParsedResult[]
  ): Promise<FileAnalysisResult | Map<string, FileAnalysisResult> | null> {
    if (Array.isArray(files) && files.length === 0) {
      return new Map()
    }

    const _date = new Date()
    const _files = Array.isArray(files) ? files : [files]

    const entities = await this.repository.getSavedEntities(_files)
    const invalidFiles = _files.filter((file) => {
      const id = `${file.fileId}-${file.version}`
      return (
        !entities.has(id) ||
        _date.getTime() - entities.get(id)!.cacheUpdatedAt!.getTime() >
          SAVED_FILE_ANALYSIS_ENTITY_EXPIRE_DELAY
      )
    })

    if (invalidFiles.length > 0) {
      this.logger.info(
        `Fetching analysis file entities for IDs: ${invalidFiles.map((file) => `${file.fileId}-${file.version}`).join(',')}`
      )

      const result = await limitedAllSettled(
        invalidFiles.map((file) => {
          return async () => {
            const result = await this.api.ref.sessionAPI.files.getFileVersionAnalysisSecurity(
              file.fileId,
              file.version
            )

            if (!result.success) {
              this.logger.error(
                `Failed to fetch file analysis for ID: ${file.fileId} version: ${file.version}, error: ${result.error.message}`
              )
            }

            return {
              fileId: file.fileId,
              version: file.version,
              ...result
            }
          }
        }),
        FILE_ANALYSIS_ENTITIES_QUERY_THREAD_SIZE
      )

      const files = result.reduce<FileAnalysisEntity[]>((arr, current) => {
        if (current.status === 'fulfilled' && current.value.success) {
          arr.push(
            toFileAnalysisEntity(
              current.value.fileId,
              current.value.version,
              current.value.value.body
            )
          )
        }

        return arr
      }, [])

      for (const file of files) {
        entities.set(`${file.fileId}-${file.fileVersion}`, file)
      }

      await this.repository.saveEntities(files)
      this.logger.info(`Fetched ${files.length} analysis file entities`)
    }

    return Array.isArray(files)
      ? <Map<string, FileAnalysisResult>>entities
      : <FileAnalysisResult | null>(entities.get(`${files.fileId}-${files.version}`) ?? null)
  }
}

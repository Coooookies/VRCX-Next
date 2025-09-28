import { FileType } from './types'
import type { FileAnalysis } from '@shared/definition/vrchat-api-response'
import type { FileAnalysisEntity } from '../database/entities/vrchat-cache-analysis-file'

export { parseFileUrl } from '@shared/utils/vrchat-url-parser'

export function toFileAnalysisEntity(
  fileId: string,
  version: number,
  file: FileAnalysis
): FileAnalysisEntity {
  let type: FileType

  if ('avatarStats' in file) {
    type = FileType.Avatar
  } else if ('worldSignature' in file) {
    type = FileType.World
  } else {
    type = FileType.Unknown
  }

  let stats: object = {}

  if (type === FileType.Avatar) {
    stats = {
      attributes: file.avatarStats,
      performance: file.performanceRating
    }
  }

  return {
    fileId,
    fileVersion: version,
    fileSize: file.fileSize,
    fileUncompressedSize: file.uncompressedSize,
    type,
    stats,
    cacheUpdatedAt: new Date()
  }
}

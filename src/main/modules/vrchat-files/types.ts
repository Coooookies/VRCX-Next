import type { Dirent, ReadStream } from 'node:fs'
import type {
  FileAnalysisAvatarStats,
  PerformanceRatings
} from '@shared/definition/vrchat-api-response'

export type DirentResolver = {
  dirent: Dirent
  mime: string
  buffer: () => Promise<Buffer<ArrayBufferLike>>
  stream: () => ReadStream
}

export const FileType = {
  Avatar: 'avatar',
  World: 'world',
  Unknown: 'unknown'
}

export type FileType = (typeof FileType)[keyof typeof FileType]

export interface FileAnalysisAvatarStatResult {
  attributes: FileAnalysisAvatarStats
  performance: PerformanceRatings
}

export interface FileAnalysisWorldStatResult {}

export type FileAnalysisResultDefinition = {
  [FileType.Avatar]: FileAnalysisAvatarStatResult
  [FileType.World]: FileAnalysisWorldStatResult
  [FileType.Unknown]: never
}

export interface FileAnalysisBase {
  fileId: string
  fileVersion: number
  fileSize: number
  fileUncompressedSize: number
  cacheUpdatedAt?: Date
}

export type FileAnalysisResult = {
  [K in FileType]: {
    type: K
    stats: FileAnalysisResultDefinition[K]
  } & FileAnalysisBase
}[FileType]

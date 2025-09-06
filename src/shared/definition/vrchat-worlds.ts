import type { ReleaseStatus } from './vrchat-api-response'

export interface WorldSummary {
  worldId: string
  worldName: string
  authorUserId: string
  description: string
  imageFileId: string
  imageFileVersion: number
  organization: string
  releaseStatus: ReleaseStatus
  updatedAt: Date
}

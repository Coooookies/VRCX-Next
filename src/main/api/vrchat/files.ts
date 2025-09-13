import { attempt } from '@shared/utils/async'
import type { Got, Response, HTTPError } from 'got'
import type { ErrorResponse, FileAnalysis } from '@shared/definition/vrchat-api-response'

export class Files {
  constructor(private client: Got) {}

  public getFileVersionAnalysisSecurity(fileId: string, version: number) {
    return attempt<Response<FileAnalysis>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get(`analysis/${fileId}/${version}/security`, {
        responseType: 'json'
      })
    )
  }
}

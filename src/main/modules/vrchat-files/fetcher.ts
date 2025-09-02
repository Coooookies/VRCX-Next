import type { Request } from 'got'
import type { VRChatAPI } from '../vrchat-api'

export class FilesFetcher {
  constructor(private api: VRChatAPI) {}

  public fetchImageStream(fileId: string, version: number, size: number): Request {
    const url = `image/${fileId}/${version}/${size}`
    const response = this.api.ref.publicAPI.client.stream(url)
    return response
  }
}

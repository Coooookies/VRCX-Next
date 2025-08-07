import type { Options, RequestError, Response } from 'got'

type HooksInput = {
  onRequest?: (requestOption: Options) => void
  onResponse?: (response: Response<unknown>) => void
  onRetry?: (error: RequestError<unknown>, count: number) => void
  onUnauthorized?: (res: Response<unknown>) => void
  onBadRequest?: (res: Response<unknown>) => void
  onForbidden?: (res: Response<unknown>) => void
  onNotFound?: (res: Response<unknown>) => void
  onRateLimit?: (res: Response<unknown>) => void
  onServerError?: (res: Response<unknown>) => void
}

export function createHooks(hooks: HooksInput = {}): Partial<Options['hooks']> {
  return {
    beforeRetry: [
      (error, count) => {
        hooks.onRetry?.(error, count)
      }
    ],
    beforeRequest: [
      (requestOption) => {
        hooks.onRequest?.(requestOption)
      }
    ],
    afterResponse: [
      (response) => {
        const { statusCode } = response
        hooks.onResponse?.(response)

        switch (statusCode) {
          case 400:
            hooks.onBadRequest?.(response)
            break
          case 401:
            hooks.onUnauthorized?.(response)
            break
          case 403:
            hooks.onForbidden?.(response)
            break
          case 404:
            hooks.onNotFound?.(response)
            break
          case 429:
            hooks.onRateLimit?.(response)
            break
          default:
            if (statusCode >= 500) {
              hooks.onServerError?.(response)
            }
            break
        }

        return response
      }
    ]
  }
}

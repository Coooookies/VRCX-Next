import { ResponseErrorReason } from '@shared/definition/vrchat-api-status'
import type { HTTPError, Response } from 'got'
import type { ErrorResponse } from '@shared/definition/vrchat-api-response'

export function tokenizeError(error: HTTPError<Response<ErrorResponse>>): ResponseErrorReason {
  if (!error.response) {
    return ResponseErrorReason.NetworkError
  }

  switch (error.response.statusCode) {
    case 400:
      return ResponseErrorReason.BadRequest
    case 401:
      return ResponseErrorReason.InvalidCredentials
    case 403:
      return ResponseErrorReason.Forbidden
    case 404:
      return ResponseErrorReason.NotFound
    case 429:
      return ResponseErrorReason.RateLimitExceeded
    case 500:
    case 502:
    case 503:
    case 504:
      return ResponseErrorReason.ServerError
    default:
      return ResponseErrorReason.UnknownError
  }
}

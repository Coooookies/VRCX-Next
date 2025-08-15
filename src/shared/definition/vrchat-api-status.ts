export type ResponseErrorReason = (typeof ResponseErrorReason)[keyof typeof ResponseErrorReason]
export const ResponseErrorReason = {
  InvalidCredentials: 'invalid_credentials',
  BadRequest: 'bad_request',
  NotFound: 'not_found',
  Forbidden: 'forbidden',
  RateLimitExceeded: 'rate_limited_exceeded',
  ServerError: 'server_error',
  NetworkError: 'network_error',
  UnknownError: 'unknown_error'
} as const

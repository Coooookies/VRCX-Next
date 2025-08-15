import { attempt } from '@shared/utils/async'
import type { Got, HTTPError, Response } from 'got'
import type {
  CurrentUser,
  ErrorResponse,
  Success,
  TwoFactorRecoveryCodes,
  Verify2FAEmailCodeResult,
  Verify2FAResult,
  VerifyAuthTokenResult
} from '@shared/definition/vrchat-api-response'

type LoginResult = CurrentUser & TwoFactorRecoveryCodes

export class Authentication {
  constructor(private client: Got) {}

  public loginWithCredential(username: string, password: string, twoFactorAuth?: string) {
    const credentialBuffer = Buffer.from(`${username}:${password}`)
    const credential = credentialBuffer.toString('base64')

    return attempt<Response<LoginResult>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get('auth/user', {
        responseType: 'json',
        headers: {
          Authorization: `Basic ${credential}`,
          Cookie: twoFactorAuth ? `twoFactorAuth=${twoFactorAuth}` : ''
        }
      })
    )
  }

  public loginWithAuthToken(authToken: string, twoFactorAuth?: string) {
    let cookie = ''
    authToken && (cookie = `auth=${authToken};`)
    twoFactorAuth && (cookie += `twoFactorAuth=${twoFactorAuth}`)

    return attempt<Response<LoginResult>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get('auth/user', {
        responseType: 'json',
        headers: {
          Cookie: cookie.trim()
        }
      })
    )
  }

  public logout(authToken: string) {
    return attempt<Response<Success>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.put('logout', {
        responseType: 'json',
        headers: {
          Cookie: `auth=${authToken}`
        }
      })
    )
  }

  public verifyAuthToken(authToken: string) {
    return attempt<Response<VerifyAuthTokenResult>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.get('auth', {
        responseType: 'json',
        headers: {
          Cookie: `auth=${authToken}`
        }
      })
    )
  }

  public verifyTOTP2FACode(authToken: string, code: string) {
    return attempt<Response<Verify2FAResult>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.post('auth/twofactorauth/totp/verify', {
        responseType: 'json',
        json: {
          code
        },
        headers: {
          Cookie: `auth=${authToken}`
        }
      })
    )
  }

  public verifyOTPEmail2FACode(authToken: string, code: string) {
    return attempt<Response<Verify2FAEmailCodeResult>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.post('auth/twofactorauth/emailotp/verify', {
        responseType: 'json',
        json: {
          code
        },
        headers: {
          Cookie: `auth=${authToken}`
        }
      })
    )
  }

  public verifyOTPRecovery2FACode(authToken: string, code: string) {
    return attempt<Response<Verify2FAResult>, HTTPError<Response<ErrorResponse>>>(() =>
      this.client.post('auth/twofactorauth/otp/verify', {
        responseType: 'json',
        json: {
          code
        },
        headers: {
          Cookie: `auth=${authToken}`
        }
      })
    )
  }
}

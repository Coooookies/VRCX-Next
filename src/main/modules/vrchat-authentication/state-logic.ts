import cookieParser from 'set-cookie-parser'
import { tokenizeError } from '../vrchat-api/exceptions'
import { getProfileIconUrl, parseFileUrl } from '../vrchat-files/parser'
import { ResponseErrorReason } from '@shared/types/vrchat-api-status'
import type { TwoFactorTypes } from '@shared/types/vrchat-api-response'
import type { VRChatAPI } from '../vrchat-api'
import type {
  AuthenticationLoginResult,
  AuthenticationUserOverview,
  AuthenticationVerify2FAResult
} from './types'

export class AuthenticationStateLogic {
  constructor(private api: VRChatAPI) {}

  public async loginWithCredential(
    username: string,
    password: string,
    twoFactorAuthToken?: string
  ): Promise<AuthenticationLoginResult> {
    const overview: AuthenticationUserOverview = {
      username,
      displayName: username
    }

    const { success, error, value } =
      await this.api.ref.publicAPI.authentication.loginWithCredential(
        username,
        password,
        twoFactorAuthToken
      )

    if (!success) {
      return {
        success: false,
        twoFactorAuthRequired: false,
        userOverview: overview,
        error: tokenizeError(error)
      }
    }

    const cookies = cookieParser(value.headers['set-cookie'] || [])
    const auth = cookies.find((cookie) => cookie.name === 'auth')

    if (!auth) {
      return {
        success: false,
        twoFactorAuthRequired: false,
        userOverview: overview,
        error: ResponseErrorReason.UnknownError
      }
    }

    if (value.body.requiresTwoFactorAuth) {
      return {
        success: true,
        authToken: auth.value,
        twoFactorAuthRequired: true,
        twoFactorAuthMethods: value.body.requiresTwoFactorAuth,
        userOverview: overview
      }
    }

    const profileIcon = getProfileIconUrl(value.body)
    const { fileId, version } = parseFileUrl(profileIcon)

    overview.profileThumbnailImageFileId = fileId
    overview.profileThumbnailImageFileVersion = version

    return {
      success: true,
      userOverview: overview,
      userInfo: value.body,
      authToken: auth.value,
      twoFactorAuthRequired: false,
      twoFactorAuthToken
    }
  }

  public async loginWithAuthToken(
    authToken: string,
    userOverview: AuthenticationUserOverview,
    twoFactorAuthToken?: string
  ): Promise<AuthenticationLoginResult> {
    const overview: AuthenticationUserOverview = {
      ...userOverview
    }

    const { success, error, value } =
      await this.api.ref.publicAPI.authentication.loginWithAuthToken(authToken, twoFactorAuthToken)

    if (!success) {
      return {
        success: false,
        twoFactorAuthRequired: false,
        userOverview: overview,
        error: tokenizeError(error)
      }
    }

    if (value.body.requiresTwoFactorAuth) {
      return {
        success: true,
        authToken,
        twoFactorAuthRequired: true,
        twoFactorAuthMethods: value.body.requiresTwoFactorAuth,
        userOverview: overview
      }
    }

    const profileIcon = getProfileIconUrl(value.body)
    const { fileId, version } = parseFileUrl(profileIcon)

    overview.displayName = value.body.displayName
    overview.profileThumbnailImageFileId = fileId
    overview.profileThumbnailImageFileVersion = version

    return {
      success: true,
      userOverview: overview,
      userInfo: value.body,
      authToken,
      twoFactorAuthRequired: false,
      twoFactorAuthToken
    }
  }

  public async logout(authToken: string): Promise<boolean> {
    const { success } = await this.api.ref.publicAPI.authentication.logout(authToken)
    return success
  }

  public async verify2FACode(
    authToken: string,
    type: TwoFactorTypes,
    code: string
  ): Promise<AuthenticationVerify2FAResult> {
    const { success, error, value } = await this.get2FAVerifyMethod(authToken, code, type)

    if (!success) {
      return {
        success: false,
        error: tokenizeError(error)
      }
    }

    const cookies = cookieParser(value.headers['set-cookie'] || [])
    const twoFactorAuthToken = cookies.find((cookie) => cookie.name === 'twoFactorAuth')

    if (!value.body.verified || !twoFactorAuthToken) {
      return {
        success: false,
        error: ResponseErrorReason.InvalidCredentials
      }
    }

    return {
      success: true,
      twoFactorAuthToken: twoFactorAuthToken.value
    }
  }

  private get2FAVerifyMethod(authToken: string, code: string, method: TwoFactorTypes) {
    switch (method) {
      case 'emailOtp':
        return this.api.ref.publicAPI.authentication.verifyOTPEmail2FACode(authToken, code)
      case 'totp':
        return this.api.ref.publicAPI.authentication.verifyTOTP2FACode(authToken, code)
      case 'otp':
        return this.api.ref.publicAPI.authentication.verifyOTPRecovery2FACode(authToken, code)
    }
  }
}

export function createAuthenticationLogic(api: VRChatAPI): AuthenticationStateLogic {
  return new AuthenticationStateLogic(api)
}

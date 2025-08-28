/* tslint:disable */
/* eslint-disable */

/**
 * https://github.com/vrchatapi/vrchatapi-javascript/blob/main/api.ts
 * The version of the OpenAPI document: 1.20.2
 * Contact: vrchatapi.lpv0t@aries.fyi
 */

/**
 *
 * @export
 * @interface APIConfig
 */
export interface APIConfig {
  /**
   * Unknown, probably voice optimization testing
   * @type {boolean}
   * @memberof APIConfig
   */
  VoiceEnableDegradation: boolean
  /**
   * Unknown, probably voice optimization testing
   * @type {boolean}
   * @memberof APIConfig
   */
  VoiceEnableReceiverLimiting: boolean
  /**
   *
   * @type {APIConfigAccessLogsUrls}
   * @memberof APIConfig
   */
  accessLogsUrls: APIConfigAccessLogsUrls
  /**
   * VRChat\'s office address
   * @type {string}
   * @memberof APIConfig
   */
  address: string
  /**
   *
   * @type {boolean}
   * @memberof APIConfig
   */
  ageVerificationInviteVisible: boolean
  /**
   *
   * @type {boolean}
   * @memberof APIConfig
   */
  ageVerificationP: boolean
  /**
   *
   * @type {boolean}
   * @memberof APIConfig
   */
  ageVerificationStatusVisible: boolean
  /**
   * Max retries for avatar analysis requests
   * @type {number}
   * @memberof APIConfig
   */
  analysisMaxRetries: number
  /**
   * Interval between retries for avatar analysis requests
   * @type {number}
   * @memberof APIConfig
   */
  analysisRetryInterval: number
  /**
   * Public Announcements
   * @type {Set<APIConfigAnnouncement>}
   * @memberof APIConfig
   */
  announcements: Set<APIConfigAnnouncement>
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfig
   */
  analyticsSegment_NewUI_PctOfUsers: number
  /**
   * Unknown
   * @type {string}
   * @memberof APIConfig
   */
  analyticsSegment_NewUI_Salt: string
  /**
   * List of supported Languages
   * @type {Array<string>}
   * @memberof APIConfig
   */
  availableLanguageCodes: Array<string>
  /**
   * List of supported Languages
   * @type {Array<string>}
   * @memberof APIConfig
   */
  availableLanguages: Array<string>
  /**
   *
   * @type {APIConfigAvatarPerfLimiter}
   * @memberof APIConfig
   */
  avatarPerfLimiter: APIConfigAvatarPerfLimiter
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfig
   */
  chatboxLogBufferSeconds: number
  /**
   * apiKey to be used for all other requests
   * @type {string}
   * @memberof APIConfig
   */
  clientApiKey: string
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfig
   */
  clientBPSCeiling: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfig
   */
  clientDisconnectTimeout: number
  /**
   * Unknown
   * @type {boolean}
   * @memberof APIConfig
   */
  clientNetDispatchThread?: boolean
  /**
   * Unknown
   * @type {boolean}
   * @memberof APIConfig
   */
  clientNetDispatchThreadMobile: boolean
  /**
   * Unknown
   * @type {boolean}
   * @memberof APIConfig
   */
  clientNetInThread?: boolean
  /**
   * Unknown
   * @type {boolean}
   * @memberof APIConfig
   */
  clientNetInThread2?: boolean
  /**
   * Unknown
   * @type {boolean}
   * @memberof APIConfig
   */
  clientNetInThreadMobile?: boolean
  /**
   * Unknown
   * @type {boolean}
   * @memberof APIConfig
   */
  clientNetInThreadMobile2?: boolean
  /**
   * Unknown
   * @type {boolean}
   * @memberof APIConfig
   */
  clientNetOutThread?: boolean
  /**
   * Unknown
   * @type {boolean}
   * @memberof APIConfig
   */
  clientNetOutThread2?: boolean
  /**
   * Unknown
   * @type {boolean}
   * @memberof APIConfig
   */
  clientNetOutThreadMobile?: boolean
  /**
   * Unknown
   * @type {boolean}
   * @memberof APIConfig
   */
  clientNetOutThreadMobile2?: boolean
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfig
   */
  clientQR?: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfig
   */
  clientReservedPlayerBPS: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfig
   */
  clientSentCountAllowance: number
  /**
   *
   * @type {APIConfigConstants}
   * @memberof APIConfig
   */
  constants: APIConfigConstants
  /**
   * VRChat\'s contact email
   * @type {string}
   * @memberof APIConfig
   */
  contactEmail: string
  /**
   * VRChat\'s copyright-issues-related email
   * @type {string}
   * @memberof APIConfig
   */
  copyrightEmail: string
  /**
   * Current version number of the Privacy Agreement
   * @type {number}
   * @memberof APIConfig
   */
  currentPrivacyVersion?: number
  /**
   * Current version number of the Terms of Service
   * @type {number}
   * @memberof APIConfig
   */
  currentTOSVersion: number
  /**
   *
   * @type {string}
   * @memberof APIConfig
   */
  defaultAvatar: string
  /**
   *
   * @type {string}
   * @memberof APIConfig
   */
  defaultStickerSet: string
  /**
   * Unknown
   * @type {Array<string>}
   * @memberof APIConfig
   */
  devLanguageCodes?: Array<string>
  /**
   * Link to download the development SDK, use downloadUrls instead
   * @type {string}
   * @memberof APIConfig
   * @deprecated
   */
  devSdkUrl: string
  /**
   * Version of the development SDK
   * @type {string}
   * @memberof APIConfig
   * @deprecated
   */
  devSdkVersion: string
  /**
   * Unknown, \"dis\" maybe for disconnect?
   * @type {string}
   * @memberof APIConfig
   */
  'dis-countdown': string
  /**
   * Unknown
   * @type {boolean}
   * @memberof APIConfig
   */
  disableAVProInProton?: boolean
  /**
   * Toggles if copying avatars should be disabled
   * @type {boolean}
   * @memberof APIConfig
   */
  disableAvatarCopying: boolean
  /**
   * Toggles if avatar gating should be disabled. Avatar gating restricts uploading of avatars to people with the `system_avatar_access` Tag or `admin_avatar_access` Tag
   * @type {boolean}
   * @memberof APIConfig
   */
  disableAvatarGating: boolean
  /**
   * Toggles if the Community Labs should be disabled
   * @type {boolean}
   * @memberof APIConfig
   */
  disableCommunityLabs: boolean
  /**
   * Toggles if promotion out of Community Labs should be disabled
   * @type {boolean}
   * @memberof APIConfig
   */
  disableCommunityLabsPromotion: boolean
  /**
   * Unknown
   * @type {boolean}
   * @memberof APIConfig
   */
  disableEmail: boolean
  /**
   * Unknown
   * @type {boolean}
   * @memberof APIConfig
   */
  disableCaptcha?: boolean
  /**
   * Toggles if Analytics should be disabled.
   * @type {boolean}
   * @memberof APIConfig
   */
  disableEventStream: boolean
  /**
   * Toggles if feedback gating should be disabled. Feedback gating restricts submission of feedback (reporting a World or User) to people with the `system_feedback_access` Tag.
   * @type {boolean}
   * @memberof APIConfig
   */
  disableFeedbackGating: boolean
  /**
   * Unknown, probably toggles compilation of frontend web builds? So internal flag?
   * @type {boolean}
   * @memberof APIConfig
   */
  disableFrontendBuilds: boolean
  /**
   * Toggles if gift drops should be disabled
   * @type {boolean}
   * @memberof APIConfig
   */
  disableGiftDrops: boolean
  /**
   * Unknown
   * @type {boolean}
   * @memberof APIConfig
   */
  disableHello: boolean
  /**
   * Toggles if signing up for Subscriptions in Oculus is disabled or not.
   * @type {boolean}
   * @memberof APIConfig
   */
  disableOculusSubs: boolean
  /**
   * Toggles if new user account registration should be disabled.
   * @type {boolean}
   * @memberof APIConfig
   */
  disableRegistration: boolean
  /**
   * Toggles if Steam Networking should be disabled. VRChat these days uses Photon Unity Networking (PUN) instead.
   * @type {boolean}
   * @memberof APIConfig
   */
  disableSteamNetworking: boolean
  /**
   * Toggles if 2FA should be disabled.
   * @type {boolean}
   * @memberof APIConfig
   * @deprecated
   */
  disableTwoFactorAuth: boolean
  /**
   * Toggles if Udon should be universally disabled in-game.
   * @type {boolean}
   * @memberof APIConfig
   */
  disableUdon: boolean
  /**
   * Toggles if account upgrading \"linking with Steam/Oculus\" should be disabled.
   * @type {boolean}
   * @memberof APIConfig
   */
  disableUpgradeAccount: boolean
  /**
   * Download link for game on the Oculus Rift website.
   * @type {string}
   * @memberof APIConfig
   */
  downloadLinkWindows: string
  /**
   *
   * @type {APIConfigDownloadURLList}
   * @memberof APIConfig
   */
  downloadUrls: APIConfigDownloadURLList
  /**
   * Array of DynamicWorldRow objects, used by the game to display the list of world rows
   * @type {Set<DynamicContentRow>}
   * @memberof APIConfig
   */
  dynamicWorldRows: Set<DynamicContentRow>
  /**
   * Unknown
   * @type {string}
   * @memberof APIConfig
   */
  economyPauseEnd?: string
  /**
   * Unknown
   * @type {string}
   * @memberof APIConfig
   */
  economyPauseStart?: string
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfig
   */
  economyState?: number
  /**
   *
   * @type {APIConfigEvents}
   * @memberof APIConfig
   */
  events: APIConfigEvents
  /**
   * Unknown
   * @type {boolean}
   * @memberof APIConfig
   */
  forceUseLatestWorld: boolean
  /**
   * Display type of gifts
   * @type {string}
   * @memberof APIConfig
   */
  giftDisplayType: string
  /**
   * Unknown
   * @type {string}
   * @memberof APIConfig
   */
  googleApiClientId: string
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof APIConfig
   */
  homeWorldId: string
  /**
   * Redirect target if you try to open the base API domain in your browser
   * @type {string}
   * @memberof APIConfig
   */
  homepageRedirectTarget: string
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof APIConfig
   */
  hubWorldId: string
  /**
   * A list of explicitly allowed origins that worlds can request images from via the Udon\'s [VRCImageDownloader#DownloadImage](https://creators.vrchat.com/worlds/udon/image-loading/#downloadimage).
   * @type {Array<string>}
   * @memberof APIConfig
   */
  imageHostUrlList: Array<string>
  /**
   * VRChat\'s job application email
   * @type {string}
   * @memberof APIConfig
   */
  jobsEmail: string
  /**
   *
   * @type {APIConfigMinSupportedClientBuildNumber}
   * @memberof APIConfig
   */
  minSupportedClientBuildNumber: APIConfigMinSupportedClientBuildNumber
  /**
   * Minimum Unity version required for uploading assets
   * @type {string}
   * @memberof APIConfig
   */
  minimumUnityVersionForUploads: string
  /**
   * VRChat\'s moderation related email
   * @type {string}
   * @memberof APIConfig
   */
  moderationEmail: string
  /**
   * Used in-game to notify a user they aren\'t allowed to select avatars in private worlds
   * @type {string}
   * @memberof APIConfig
   */
  notAllowedToSelectAvatarInPrivateWorldMessage: string
  /**
   *
   * @type {APIConfigOfflineAnalysis}
   * @memberof APIConfig
   */
  offlineAnalysis: APIConfigOfflineAnalysis
  /**
   * Unknown
   * @type {Array<string>}
   * @memberof APIConfig
   */
  photonNameserverOverrides: Array<string>
  /**
   * Unknown
   * @type {Array<string>}
   * @memberof APIConfig
   */
  photonPublicKeys: Array<string>
  /**
   *
   * @type {APIConfigReportCategories}
   * @memberof APIConfig
   */
  reportCategories: APIConfigReportCategories
  /**
   * URL to the report form
   * @type {string}
   * @memberof APIConfig
   */
  reportFormUrl: string
  /**
   *
   * @type {APIConfigReportOptions}
   * @memberof APIConfig
   */
  reportOptions: APIConfigReportOptions
  /**
   *
   * @type {APIConfigReportReasons}
   * @memberof APIConfig
   */
  reportReasons: APIConfigReportReasons
  /**
   *
   * @type {boolean}
   * @memberof APIConfig
   */
  requireAgeVerificationBetaTag: boolean
  /**
   * Link to the developer FAQ
   * @type {string}
   * @memberof APIConfig
   */
  sdkDeveloperFaqUrl: string
  /**
   * Link to the official VRChat Discord
   * @type {string}
   * @memberof APIConfig
   */
  sdkDiscordUrl: string
  /**
   * Used in the SDK to notify a user they aren\'t allowed to upload avatars/worlds yet
   * @type {string}
   * @memberof APIConfig
   */
  sdkNotAllowedToPublishMessage: string
  /**
   * Unity version supported by the SDK
   * @type {string}
   * @memberof APIConfig
   */
  sdkUnityVersion: string
  /**
   * A list of explicitly allowed origins that worlds can request strings from via the Udon\'s [VRCStringDownloader.LoadUrl](https://creators.vrchat.com/worlds/udon/string-loading/#ivrcstringdownload).
   * @type {Array<string>}
   * @memberof APIConfig
   */
  stringHostUrlList: Array<string>
  /**
   * VRChat\'s support email
   * @type {string}
   * @memberof APIConfig
   */
  supportEmail: string
  /**
   * VRChat\'s support form
   * @type {string}
   * @memberof APIConfig
   */
  supportFormUrl: string
  /**
   * Unknown
   * @type {boolean}
   * @memberof APIConfig
   */
  timekeeping: boolean
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof APIConfig
   */
  timeOutWorldId: string
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof APIConfig
   */
  tutorialWorldId: string
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfig
   */
  updateRateMsMaximum: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfig
   */
  updateRateMsMinimum: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfig
   */
  updateRateMsNormal: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfig
   */
  updateRateMsUdonManual: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfig
   */
  uploadAnalysisPercent: number
  /**
   * List of allowed URLs that bypass the \"Allow untrusted URL\'s\" setting in-game
   * @type {Array<string>}
   * @memberof APIConfig
   */
  urlList: Array<string>
  /**
   * Unknown
   * @type {boolean}
   * @memberof APIConfig
   */
  useReliableUdpForVoice: boolean
  /**
   * Download link for game on the Steam website.
   * @type {string}
   * @memberof APIConfig
   */
  viveWindowsUrl: string
  /**
   * List of allowed URLs that are allowed to host avatar assets
   * @type {Array<string>}
   * @memberof APIConfig
   */
  whiteListedAssetUrls: Array<string>
  /**
   * Currently used youtube-dl.exe version
   * @type {string}
   * @memberof APIConfig
   */
  'player-url-resolver-version': string
  /**
   * Currently used youtube-dl.exe hash in SHA1-delimited format
   * @type {string}
   * @memberof APIConfig
   */
  'player-url-resolver-sha1': string
  /**
   * Public key, hex encoded
   * @type {string}
   * @memberof APIConfig
   */
  publicKey: string
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfig
   */
  websocketMaxFriendsRefreshDelay: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfig
   */
  websocketQuickReconnectTime: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfig
   */
  websocketReconnectMaxDelay: number
}
/**
 *
 * @export
 * @interface APIConfigAccessLogsUrls
 */
export interface APIConfigAccessLogsUrls {
  /**
   *
   * @type {string}
   * @memberof APIConfigAccessLogsUrls
   */
  Default?: string
  /**
   *
   * @type {string}
   * @memberof APIConfigAccessLogsUrls
   */
  Pico?: string
  /**
   *
   * @type {string}
   * @memberof APIConfigAccessLogsUrls
   */
  Quest?: string
  /**
   *
   * @type {string}
   * @memberof APIConfigAccessLogsUrls
   */
  XRElite?: string
}
/**
 * Public Announcement
 * @export
 * @interface APIConfigAnnouncement
 */
export interface APIConfigAnnouncement {
  /**
   * Announcement name
   * @type {string}
   * @memberof APIConfigAnnouncement
   */
  name: string
  /**
   * Announcement text
   * @type {string}
   * @memberof APIConfigAnnouncement
   */
  text: string
}
/**
 *
 * @export
 * @interface APIConfigAvatarPerfLimiter
 */
export interface APIConfigAvatarPerfLimiter {
  /**
   *
   * @type {PerformanceLimiterInfo}
   * @memberof APIConfigAvatarPerfLimiter
   */
  AndroidMobile: PerformanceLimiterInfo
  /**
   *
   * @type {PerformanceLimiterInfo}
   * @memberof APIConfigAvatarPerfLimiter
   */
  PC: PerformanceLimiterInfo
  /**
   *
   * @type {PerformanceLimiterInfo}
   * @memberof APIConfigAvatarPerfLimiter
   */
  Pico: PerformanceLimiterInfo
  /**
   *
   * @type {PerformanceLimiterInfo}
   * @memberof APIConfigAvatarPerfLimiter
   */
  Quest: PerformanceLimiterInfo
  /**
   *
   * @type {PerformanceLimiterInfo}
   * @memberof APIConfigAvatarPerfLimiter
   */
  XRElite: PerformanceLimiterInfo
  /**
   *
   * @type {PerformanceLimiterInfo}
   * @memberof APIConfigAvatarPerfLimiter
   */
  iOSMobile: PerformanceLimiterInfo
}
/**
 * Constants
 * @export
 * @interface APIConfigConstants
 */
export interface APIConfigConstants {
  /**
   *
   * @type {APIConfigConstantsGROUPS}
   * @memberof APIConfigConstants
   */
  GROUPS: APIConfigConstantsGROUPS
  /**
   *
   * @type {APIConfigConstantsINSTANCE}
   * @memberof APIConfigConstants
   */
  INSTANCE: APIConfigConstantsINSTANCE
  /**
   *
   * @type {APIConfigConstantsLANGUAGE}
   * @memberof APIConfigConstants
   */
  LANGUAGE: APIConfigConstantsLANGUAGE
}
/**
 * Group-related constants
 * @export
 * @interface APIConfigConstantsGROUPS
 */
export interface APIConfigConstantsGROUPS {
  /**
   * Maximum group capacity
   * @type {number}
   * @memberof APIConfigConstantsGROUPS
   */
  CAPACITY?: number
  /**
   * Requirements for transferring group ownership
   * @type {Array<string>}
   * @memberof APIConfigConstantsGROUPS
   */
  GROUP_TRANSFER_REQUIREMENTS?: Array<string>
  /**
   * Maximum number of invite requests
   * @type {number}
   * @memberof APIConfigConstantsGROUPS
   */
  MAX_INVITES_REQUESTS?: number
  /**
   * Maximum number of joined groups
   * @type {number}
   * @memberof APIConfigConstantsGROUPS
   */
  MAX_JOINED?: number
  /**
   * Maximum number of joined groups for VRChat Plus members
   * @type {number}
   * @memberof APIConfigConstantsGROUPS
   */
  MAX_JOINED_PLUS?: number
  /**
   * Maximum number of supported languages
   * @type {number}
   * @memberof APIConfigConstantsGROUPS
   */
  MAX_LANGUAGES?: number
  /**
   * Maximum number of group links
   * @type {number}
   * @memberof APIConfigConstantsGROUPS
   */
  MAX_LINKS?: number
  /**
   * Maximum number of management roles in a group
   * @type {number}
   * @memberof APIConfigConstantsGROUPS
   */
  MAX_MANAGEMENT_ROLES?: number
  /**
   * Maximum number of groups a user can own
   * @type {number}
   * @memberof APIConfigConstantsGROUPS
   */
  MAX_OWNED?: number
  /**
   * Maximum number of roles in a group
   * @type {number}
   * @memberof APIConfigConstantsGROUPS
   */
  MAX_ROLES?: number
}
/**
 * Instance-related constants
 * @export
 * @interface APIConfigConstantsINSTANCE
 */
export interface APIConfigConstantsINSTANCE {
  /**
   *
   * @type {APIConfigConstantsINSTANCEPOPULATIONBRACKETS}
   * @memberof APIConfigConstantsINSTANCE
   */
  POPULATION_BRACKETS?: APIConfigConstantsINSTANCEPOPULATIONBRACKETS
}
/**
 * Population brackets based on instance population
 * @export
 * @interface APIConfigConstantsINSTANCEPOPULATIONBRACKETS
 */
export interface APIConfigConstantsINSTANCEPOPULATIONBRACKETS {
  /**
   *
   * @type {APIConfigConstantsINSTANCEPOPULATIONBRACKETSCROWDED}
   * @memberof APIConfigConstantsINSTANCEPOPULATIONBRACKETS
   */
  CROWDED?: APIConfigConstantsINSTANCEPOPULATIONBRACKETSCROWDED
  /**
   *
   * @type {APIConfigConstantsINSTANCEPOPULATIONBRACKETSFEW}
   * @memberof APIConfigConstantsINSTANCEPOPULATIONBRACKETS
   */
  FEW?: APIConfigConstantsINSTANCEPOPULATIONBRACKETSFEW
  /**
   *
   * @type {APIConfigConstantsINSTANCEPOPULATIONBRACKETSMANY}
   * @memberof APIConfigConstantsINSTANCEPOPULATIONBRACKETS
   */
  MANY?: APIConfigConstantsINSTANCEPOPULATIONBRACKETSMANY
}
/**
 * Crowded population range
 * @export
 * @interface APIConfigConstantsINSTANCEPOPULATIONBRACKETSCROWDED
 */
export interface APIConfigConstantsINSTANCEPOPULATIONBRACKETSCROWDED {
  /**
   * Maximum population for a crowded instance
   * @type {number}
   * @memberof APIConfigConstantsINSTANCEPOPULATIONBRACKETSCROWDED
   */
  max?: number
  /**
   * Minimum population for a crowded instance
   * @type {number}
   * @memberof APIConfigConstantsINSTANCEPOPULATIONBRACKETSCROWDED
   */
  min?: number
}
/**
 * Few population range
 * @export
 * @interface APIConfigConstantsINSTANCEPOPULATIONBRACKETSFEW
 */
export interface APIConfigConstantsINSTANCEPOPULATIONBRACKETSFEW {
  /**
   * Maximum population for a few instance
   * @type {number}
   * @memberof APIConfigConstantsINSTANCEPOPULATIONBRACKETSFEW
   */
  max?: number
  /**
   * Minimum population for a few instance
   * @type {number}
   * @memberof APIConfigConstantsINSTANCEPOPULATIONBRACKETSFEW
   */
  min?: number
}
/**
 * Many population range
 * @export
 * @interface APIConfigConstantsINSTANCEPOPULATIONBRACKETSMANY
 */
export interface APIConfigConstantsINSTANCEPOPULATIONBRACKETSMANY {
  /**
   * Maximum population for a many instance
   * @type {number}
   * @memberof APIConfigConstantsINSTANCEPOPULATIONBRACKETSMANY
   */
  max?: number
  /**
   * Minimum population for a many instance
   * @type {number}
   * @memberof APIConfigConstantsINSTANCEPOPULATIONBRACKETSMANY
   */
  min?: number
}
/**
 * Language-related constants
 * @export
 * @interface APIConfigConstantsLANGUAGE
 */
export interface APIConfigConstantsLANGUAGE {
  /**
   * Supported spoken language options
   * @type {{ [key: string]: string; }}
   * @memberof APIConfigConstantsLANGUAGE
   */
  SPOKEN_LANGUAGE_OPTIONS?: { [key: string]: string }
}
/**
 * Download links for various development assets.
 * @export
 * @interface APIConfigDownloadURLList
 */
export interface APIConfigDownloadURLList {
  /**
   * Download link for legacy SDK2
   * @type {string}
   * @memberof APIConfigDownloadURLList
   * @deprecated
   */
  sdk2: string
  /**
   * Download link for SDK3 for Avatars
   * @type {string}
   * @memberof APIConfigDownloadURLList
   */
  'sdk3-avatars': string
  /**
   * Download link for SDK3 for Worlds
   * @type {string}
   * @memberof APIConfigDownloadURLList
   */
  'sdk3-worlds': string
  /**
   * Download link for the Creator Companion
   * @type {string}
   * @memberof APIConfigDownloadURLList
   */
  vcc: string
  /**
   * Download link for ???
   * @type {string}
   * @memberof APIConfigDownloadURLList
   */
  bootstrap: string
}
/**
 *
 * @export
 * @interface APIConfigEvents
 */
export interface APIConfigEvents {
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfigEvents
   */
  distanceClose: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfigEvents
   */
  distanceFactor: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfigEvents
   */
  distanceFar: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfigEvents
   */
  groupDistance: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfigEvents
   */
  maximumBunchSize: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfigEvents
   */
  notVisibleFactor: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfigEvents
   */
  playerOrderBucketSize: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfigEvents
   */
  playerOrderFactor: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfigEvents
   */
  slowUpdateFactorThreshold: number
  /**
   * Unknown
   * @type {number}
   * @memberof APIConfigEvents
   */
  viewSegmentLength: number
}
/**
 * Minimum supported client build number for various platforms
 * @export
 * @interface APIConfigMinSupportedClientBuildNumber
 */
export interface APIConfigMinSupportedClientBuildNumber {
  /**
   *
   * @type {PlatformBuildInfo}
   * @memberof APIConfigMinSupportedClientBuildNumber
   */
  AppStore: PlatformBuildInfo
  /**
   *
   * @type {PlatformBuildInfo}
   * @memberof APIConfigMinSupportedClientBuildNumber
   */
  Default: PlatformBuildInfo
  /**
   *
   * @type {PlatformBuildInfo}
   * @memberof APIConfigMinSupportedClientBuildNumber
   */
  Firebase: PlatformBuildInfo
  /**
   *
   * @type {PlatformBuildInfo}
   * @memberof APIConfigMinSupportedClientBuildNumber
   */
  FirebaseiOS: PlatformBuildInfo
  /**
   *
   * @type {PlatformBuildInfo}
   * @memberof APIConfigMinSupportedClientBuildNumber
   */
  GooglePlay: PlatformBuildInfo
  /**
   *
   * @type {PlatformBuildInfo}
   * @memberof APIConfigMinSupportedClientBuildNumber
   */
  PC: PlatformBuildInfo
  /**
   *
   * @type {PlatformBuildInfo}
   * @memberof APIConfigMinSupportedClientBuildNumber
   */
  PicoStore: PlatformBuildInfo
  /**
   *
   * @type {PlatformBuildInfo}
   * @memberof APIConfigMinSupportedClientBuildNumber
   */
  QuestAppLab: PlatformBuildInfo
  /**
   *
   * @type {PlatformBuildInfo}
   * @memberof APIConfigMinSupportedClientBuildNumber
   */
  QuestStore: PlatformBuildInfo
  /**
   *
   * @type {PlatformBuildInfo}
   * @memberof APIConfigMinSupportedClientBuildNumber
   */
  TestFlight: PlatformBuildInfo
  /**
   *
   * @type {PlatformBuildInfo}
   * @memberof APIConfigMinSupportedClientBuildNumber
   */
  XRElite: PlatformBuildInfo
}
/**
 * Whether to allow offline analysis
 * @export
 * @interface APIConfigOfflineAnalysis
 */
export interface APIConfigOfflineAnalysis {
  /**
   * Whether to allow offline analysis
   * @type {boolean}
   * @memberof APIConfigOfflineAnalysis
   */
  android?: boolean
  /**
   * Whether to allow offline analysis
   * @type {boolean}
   * @memberof APIConfigOfflineAnalysis
   */
  standalonewindows?: boolean
}
/**
 * Categories available for reporting objectionable content
 * @export
 * @interface APIConfigReportCategories
 */
export interface APIConfigReportCategories {
  /**
   *
   * @type {ReportCategory}
   * @memberof APIConfigReportCategories
   */
  avatar: ReportCategory
  /**
   *
   * @type {ReportCategory}
   * @memberof APIConfigReportCategories
   */
  avatarpage?: ReportCategory
  /**
   *
   * @type {ReportCategory}
   * @memberof APIConfigReportCategories
   */
  behavior: ReportCategory
  /**
   *
   * @type {ReportCategory}
   * @memberof APIConfigReportCategories
   */
  chat: ReportCategory
  /**
   *
   * @type {ReportCategory}
   * @memberof APIConfigReportCategories
   */
  emoji?: ReportCategory
  /**
   *
   * @type {ReportCategory}
   * @memberof APIConfigReportCategories
   */
  environment: ReportCategory
  /**
   *
   * @type {ReportCategory}
   * @memberof APIConfigReportCategories
   */
  groupstore: ReportCategory
  /**
   *
   * @type {ReportCategory}
   * @memberof APIConfigReportCategories
   */
  image: ReportCategory
  /**
   *
   * @type {ReportCategory}
   * @memberof APIConfigReportCategories
   */
  text: ReportCategory
  /**
   *
   * @type {ReportCategory}
   * @memberof APIConfigReportCategories
   */
  sticker?: ReportCategory
  /**
   *
   * @type {ReportCategory}
   * @memberof APIConfigReportCategories
   */
  warnings: ReportCategory
  /**
   *
   * @type {ReportCategory}
   * @memberof APIConfigReportCategories
   */
  worldimage: ReportCategory
  /**
   *
   * @type {ReportCategory}
   * @memberof APIConfigReportCategories
   */
  worldstore: ReportCategory
}
/**
 * Options for reporting content
 * @export
 * @interface APIConfigReportOptions
 */
export interface APIConfigReportOptions {
  /**
   *
   * @type {APIConfigReportOptionsAvatar}
   * @memberof APIConfigReportOptions
   */
  avatar?: APIConfigReportOptionsAvatar
  /**
   *
   * @type {APIConfigReportOptionsGroup}
   * @memberof APIConfigReportOptions
   */
  group?: APIConfigReportOptionsGroup
  /**
   *
   * @type {APIConfigReportOptionsUser}
   * @memberof APIConfigReportOptions
   */
  user?: APIConfigReportOptionsUser
  /**
   *
   * @type {APIConfigReportOptionsWorld}
   * @memberof APIConfigReportOptions
   */
  world?: APIConfigReportOptionsWorld
}
/**
 *
 * @export
 * @interface APIConfigReportOptionsAvatar
 */
export interface APIConfigReportOptionsAvatar {
  /**
   *
   * @type {Array<string>}
   * @memberof APIConfigReportOptionsAvatar
   */
  avatar?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof APIConfigReportOptionsAvatar
   */
  avatarpage?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof APIConfigReportOptionsAvatar
   */
  warnings?: Array<string>
}
/**
 *
 * @export
 * @interface APIConfigReportOptionsGroup
 */
export interface APIConfigReportOptionsGroup {
  /**
   *
   * @type {Array<string>}
   * @memberof APIConfigReportOptionsGroup
   */
  groupstore?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof APIConfigReportOptionsGroup
   */
  image?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof APIConfigReportOptionsGroup
   */
  text?: Array<string>
}
/**
 *
 * @export
 * @interface APIConfigReportOptionsUser
 */
export interface APIConfigReportOptionsUser {
  /**
   *
   * @type {Array<string>}
   * @memberof APIConfigReportOptionsUser
   */
  behavior?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof APIConfigReportOptionsUser
   */
  chat?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof APIConfigReportOptionsUser
   */
  emoji?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof APIConfigReportOptionsUser
   */
  image?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof APIConfigReportOptionsUser
   */
  sticker?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof APIConfigReportOptionsUser
   */
  text?: Array<string>
}
/**
 *
 * @export
 * @interface APIConfigReportOptionsWorld
 */
export interface APIConfigReportOptionsWorld {
  /**
   *
   * @type {Array<string>}
   * @memberof APIConfigReportOptionsWorld
   */
  environment?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof APIConfigReportOptionsWorld
   */
  text?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof APIConfigReportOptionsWorld
   */
  warnings?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof APIConfigReportOptionsWorld
   */
  worldimage?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof APIConfigReportOptionsWorld
   */
  worldstore?: Array<string>
}
/**
 * Reasons available for reporting users
 * @export
 * @interface APIConfigReportReasons
 */
export interface APIConfigReportReasons {
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  billing: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  botting: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  cancellation: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  copyright?: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  fraud?: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  gore: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  hacking: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  harassing: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  hateful: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  impersonation: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  inappropriate: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  leaking: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  malicious: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  missing: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  nudity: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  renewal: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  security: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  service: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  sexual: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  technical?: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  threatening: ReportReason
  /**
   *
   * @type {ReportReason}
   * @memberof APIConfigReportReasons
   */
  visuals: ReportReason
}
/**
 *
 * @export
 * @interface APIHealth
 */
export interface APIHealth {
  /**
   *
   * @type {boolean}
   * @memberof APIHealth
   */
  ok: boolean
  /**
   *
   * @type {string}
   * @memberof APIHealth
   */
  serverName: string
  /**
   *
   * @type {string}
   * @memberof APIHealth
   */
  buildVersionTag: string
}
/**
 *
 * @export
 * @interface AccountDeletionLog
 */
export interface AccountDeletionLog {
  /**
   * Typically \"Deletion requested\" or \"Deletion canceled\". Other messages like \"Deletion completed\" may exist, but are these are not possible to see as a regular user.
   * @type {string}
   * @memberof AccountDeletionLog
   */
  message?: string
  /**
   * When the deletion is scheduled to happen, standard is 14 days after the request.
   * @type {string}
   * @memberof AccountDeletionLog
   */
  deletionScheduled?: string | null
  /**
   * Date and time of the deletion request.
   * @type {string}
   * @memberof AccountDeletionLog
   */
  dateTime?: string
}
/**
 *
 * @export
 * @interface AddFavoriteRequest
 */
export interface AddFavoriteRequest {
  /**
   *
   * @type {FavoriteType}
   * @memberof AddFavoriteRequest
   */
  type: FavoriteType
  /**
   * Must be either AvatarID, WorldID or UserID.
   * @type {string}
   * @memberof AddFavoriteRequest
   */
  favoriteId: string
  /**
   * Tags indicate which group this favorite belongs to. Adding multiple groups makes it show up in all. Removing it from one in that case removes it from all.
   * @type {Array<string>}
   * @memberof AddFavoriteRequest
   */
  tags: Array<string>
}
/**
 *
 * @export
 * @interface AddGroupGalleryImageRequest
 */
export interface AddGroupGalleryImageRequest {
  /**
   *
   * @type {string}
   * @memberof AddGroupGalleryImageRequest
   */
  fileId: string
}
/**
 *
 * @export
 * @interface AdminAssetBundle
 */
export interface AdminAssetBundle {
  /**
   *
   * @type {string}
   * @memberof AdminAssetBundle
   */
  _created_at: string
  /**
   *
   * @type {string}
   * @memberof AdminAssetBundle
   */
  _updated_at: string
  /**
   *
   * @type {string}
   * @memberof AdminAssetBundle
   */
  assetType: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof AdminAssetBundle
   */
  authorId: string
  /**
   *
   * @type {string}
   * @memberof AdminAssetBundle
   */
  authorName: string
  /**
   *
   * @type {string}
   * @memberof AdminAssetBundle
   */
  description: string
  /**
   *
   * @type {string}
   * @memberof AdminAssetBundle
   */
  imageUrl: string
  /**
   *
   * @type {string}
   * @memberof AdminAssetBundle
   */
  name: string
  /**
   *
   * @type {ReleaseStatus}
   * @memberof AdminAssetBundle
   */
  releaseStatus: ReleaseStatus
  /**
   *
   * @type {Array<string>}
   * @memberof AdminAssetBundle
   */
  tags: Array<string>
  /**
   *
   * @type {string}
   * @memberof AdminAssetBundle
   */
  thumbnailImageUrl: string
  /**
   *
   * @type {string}
   * @memberof AdminAssetBundle
   */
  unityPackageUrl: string | null
  /**
   *
   * @type {Set<AdminUnityPackage>}
   * @memberof AdminAssetBundle
   */
  unityPackages: Set<AdminUnityPackage>
}
/**
 *
 * @export
 * @interface AdminUnityPackage
 */
export interface AdminUnityPackage {
  /**
   *
   * @type {string}
   * @memberof AdminUnityPackage
   */
  assetUrl: string
  /**
   *
   * @type {number}
   * @memberof AdminUnityPackage
   */
  assetVersion: number
  /**
   * This can be `standalonewindows` or `android`, but can also pretty much be any random Unity verison such as `2019.2.4-801-Release` or `2019.2.2-772-Release` or even `unknownplatform`.
   * @type {string}
   * @memberof AdminUnityPackage
   */
  platform: string
  /**
   *
   * @type {string}
   * @memberof AdminUnityPackage
   */
  unityVersion: string
  /**
   *
   * @type {string}
   * @memberof AdminUnityPackage
   */
  variant: string
}
/**
 * `verified` is obsolete.  User who have verified and are 18+ can switch to `plus18` status.
 * @export
 * @enum {string}
 */

export const AgeVerificationStatus = {
  hidden: 'hidden',
  verified: 'verified',
  plus18: '18+'
} as const

export type AgeVerificationStatus =
  (typeof AgeVerificationStatus)[keyof typeof AgeVerificationStatus]

/**
 *
 * @export
 * @interface Avatar
 */
export interface Avatar {
  /**
   *
   * @type {string}
   * @memberof Avatar
   */
  acknowledgements?: string
  /**
   * Not present from general search `/avatars`, only on specific requests `/avatars/{avatarId}`.
   * @type {string}
   * @memberof Avatar
   */
  assetUrl?: string
  /**
   * Not present from general search `/avatars`, only on specific requests `/avatars/{avatarId}`. **Deprecation:** `Object` has unknown usage/fields, and is always empty. Use normal `Url` field instead.
   * @type {object}
   * @memberof Avatar
   */
  assetUrlObject?: object
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof Avatar
   */
  authorId: string
  /**
   *
   * @type {string}
   * @memberof Avatar
   */
  authorName: string
  /**
   *
   * @type {string}
   * @memberof Avatar
   */
  created_at: string
  /**
   *
   * @type {string}
   * @memberof Avatar
   */
  description: string
  /**
   *
   * @type {boolean}
   * @memberof Avatar
   */
  featured: boolean
  /**
   *
   * @type {number}
   * @memberof Avatar
   */
  highestPrice?: number
  /**
   *
   * @type {string}
   * @memberof Avatar
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Avatar
   */
  imageUrl: string
  /**
   *
   * @type {boolean}
   * @memberof Avatar
   */
  lock?: boolean
  /**
   *
   * @type {number}
   * @memberof Avatar
   */
  lowestPrice?: number
  /**
   *
   * @type {string}
   * @memberof Avatar
   */
  name: string
  /**
   *
   * @type {AvatarPerformance}
   * @memberof Avatar
   */
  performance: AvatarPerformance
  /**
   *
   * @type {string}
   * @memberof Avatar
   */
  productId?: string
  /**
   *
   * @type {Array<AvatarPublishedListingsInner>}
   * @memberof Avatar
   */
  publishedListings?: Array<AvatarPublishedListingsInner>
  /**
   *
   * @type {ReleaseStatus}
   * @memberof Avatar
   */
  releaseStatus: ReleaseStatus
  /**
   *
   * @type {boolean}
   * @memberof Avatar
   */
  searchable?: boolean
  /**
   *
   * @type {AvatarStyles}
   * @memberof Avatar
   */
  styles: AvatarStyles
  /**
   *
   * @type {Array<string>}
   * @memberof Avatar
   */
  tags: Array<string>
  /**
   *
   * @type {string}
   * @memberof Avatar
   */
  thumbnailImageUrl: string
  /**
   *
   * @type {string}
   * @memberof Avatar
   */
  unityPackageUrl: string
  /**
   *
   * @type {AvatarUnityPackageUrlObject}
   * @memberof Avatar
   * @deprecated
   */
  unityPackageUrlObject: AvatarUnityPackageUrlObject
  /**
   *
   * @type {Set<UnityPackage>}
   * @memberof Avatar
   */
  unityPackages: Set<UnityPackage>
  /**
   *
   * @type {string}
   * @memberof Avatar
   */
  updated_at: string
  /**
   *
   * @type {number}
   * @memberof Avatar
   */
  version: number
}
/**
 *
 * @export
 * @interface AvatarPerformance
 */
export interface AvatarPerformance {
  /**
   *
   * @type {string}
   * @memberof AvatarPerformance
   */
  android?: string
  /**
   *
   * @type {number}
   * @memberof AvatarPerformance
   */
  'android-sort'?: number
  /**
   *
   * @type {string}
   * @memberof AvatarPerformance
   */
  ios?: string
  /**
   *
   * @type {number}
   * @memberof AvatarPerformance
   */
  'ios-sort'?: number
  /**
   *
   * @type {string}
   * @memberof AvatarPerformance
   */
  standalonewindows?: string
  /**
   *
   * @type {number}
   * @memberof AvatarPerformance
   */
  'standalonewindows-sort'?: number
}
/**
 *
 * @export
 * @interface AvatarPublishedListingsInner
 */
export interface AvatarPublishedListingsInner {
  /**
   *
   * @type {string}
   * @memberof AvatarPublishedListingsInner
   */
  description?: string
  /**
   *
   * @type {string}
   * @memberof AvatarPublishedListingsInner
   */
  displayName?: string
  /**
   *
   * @type {string}
   * @memberof AvatarPublishedListingsInner
   */
  imageId?: string
  /**
   *
   * @type {string}
   * @memberof AvatarPublishedListingsInner
   */
  listingId?: string
  /**
   *
   * @type {string}
   * @memberof AvatarPublishedListingsInner
   */
  listingType?: string
  /**
   *
   * @type {number}
   * @memberof AvatarPublishedListingsInner
   */
  priceTokens?: number
}
/**
 *
 * @export
 * @interface AvatarStyle
 */
export interface AvatarStyle {
  /**
   *
   * @type {string}
   * @memberof AvatarStyle
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof AvatarStyle
   */
  styleName: string
}
/**
 *
 * @export
 * @interface AvatarStyles
 */
export interface AvatarStyles {
  /**
   *
   * @type {string}
   * @memberof AvatarStyles
   */
  primary?: string | null
  /**
   *
   * @type {string}
   * @memberof AvatarStyles
   */
  secondary?: string | null
  /**
   *
   * @type {Array<string>}
   * @memberof AvatarStyles
   */
  supplementary?: Array<string>
}
/**
 * **Deprecation:** `Object` has unknown usage/fields, and is always empty. Use normal `Url` field instead.
 * @export
 * @interface AvatarUnityPackageUrlObject
 */
export interface AvatarUnityPackageUrlObject {
  /**
   *
   * @type {string}
   * @memberof AvatarUnityPackageUrlObject
   */
  unityPackageUrl?: string
}
/**
 *
 * @export
 * @interface Badge
 */
export interface Badge {
  /**
   * only present in CurrentUser badges
   * @type {string}
   * @memberof Badge
   */
  assignedAt?: string | null
  /**
   *
   * @type {string}
   * @memberof Badge
   */
  badgeDescription: string
  /**
   *
   * @type {string}
   * @memberof Badge
   */
  badgeId: string
  /**
   * direct url to image
   * @type {string}
   * @memberof Badge
   */
  badgeImageUrl: string
  /**
   *
   * @type {string}
   * @memberof Badge
   */
  badgeName: string
  /**
   * only present in CurrentUser badges
   * @type {boolean}
   * @memberof Badge
   */
  hidden?: boolean | null
  /**
   *
   * @type {boolean}
   * @memberof Badge
   */
  showcased: boolean
  /**
   * only present in CurrentUser badges
   * @type {string}
   * @memberof Badge
   */
  updatedAt?: string | null
}
/**
 *
 * @export
 * @interface Balance
 */
export interface Balance {
  /**
   *
   * @type {number}
   * @memberof Balance
   */
  balance: number
  /**
   *
   * @type {boolean}
   * @memberof Balance
   */
  noTransactions?: boolean
  /**
   *
   * @type {boolean}
   * @memberof Balance
   */
  tiliaResponse?: boolean
}
/**
 *
 * @export
 * @interface BanGroupMemberRequest
 */
export interface BanGroupMemberRequest {
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof BanGroupMemberRequest
   */
  userId: string
}
/**
 *
 * @export
 * @interface CalendarEvent
 */
export interface CalendarEvent {
  /**
   *
   * @type {string}
   * @memberof CalendarEvent
   */
  accessType: string
  /**
   *
   * @type {string}
   * @memberof CalendarEvent
   */
  category?: string
  /**
   *
   * @type {number}
   * @memberof CalendarEvent
   */
  closeInstanceAfterEndMinutes?: number
  /**
   *
   * @type {string}
   * @memberof CalendarEvent
   */
  createdAt: string
  /**
   *
   * @type {string}
   * @memberof CalendarEvent
   */
  deletedAt?: string | null
  /**
   *
   * @type {string}
   * @memberof CalendarEvent
   */
  description?: string
  /**
   *
   * @type {string}
   * @memberof CalendarEvent
   */
  endsAt?: string
  /**
   *
   * @type {boolean}
   * @memberof CalendarEvent
   */
  featured?: boolean
  /**
   *
   * @type {number}
   * @memberof CalendarEvent
   */
  guestEarlyJoinMinutes?: number
  /**
   *
   * @type {number}
   * @memberof CalendarEvent
   */
  hostEarlyJoinMinutes?: number
  /**
   *
   * @type {string}
   * @memberof CalendarEvent
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof CalendarEvent
   */
  imageId?: string
  /**
   *
   * @type {string}
   * @memberof CalendarEvent
   */
  imageUrl?: string | null
  /**
   *
   * @type {number}
   * @memberof CalendarEvent
   */
  interestedUserCount?: number
  /**
   *
   * @type {boolean}
   * @memberof CalendarEvent
   */
  isDraft?: boolean
  /**
   *
   * @type {Array<string>}
   * @memberof CalendarEvent
   */
  languages?: Array<string>
  /**
   *
   * @type {string}
   * @memberof CalendarEvent
   */
  ownerId?: string
  /**
   *
   * @type {Array<string>}
   * @memberof CalendarEvent
   */
  platforms?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof CalendarEvent
   */
  roleIds?: Array<string> | null
  /**
   *
   * @type {string}
   * @memberof CalendarEvent
   */
  startsAt?: string
  /**
   *
   * @type {Array<string>}
   * @memberof CalendarEvent
   */
  tags?: Array<string>
  /**
   *
   * @type {string}
   * @memberof CalendarEvent
   */
  title: string
  /**
   *
   * @type {string}
   * @memberof CalendarEvent
   */
  type?: string
  /**
   *
   * @type {string}
   * @memberof CalendarEvent
   */
  updatedAt?: string
  /**
   *
   * @type {boolean}
   * @memberof CalendarEvent
   */
  usesInstanceOverflow?: boolean
  /**
   *
   * @type {CalendarEventUserInterest}
   * @memberof CalendarEvent
   */
  userInterest?: CalendarEventUserInterest
}
/**
 *
 * @export
 * @interface CalendarEventUserInterest
 */
export interface CalendarEventUserInterest {
  /**
   *
   * @type {string}
   * @memberof CalendarEventUserInterest
   */
  createdAt?: string
  /**
   *
   * @type {boolean}
   * @memberof CalendarEventUserInterest
   */
  isFollowing?: boolean
  /**
   *
   * @type {string}
   * @memberof CalendarEventUserInterest
   */
  updatedAt?: string
}
/**
 *
 * @export
 * @interface ChangeUserTagsRequest
 */
export interface ChangeUserTagsRequest {
  /**
   * The tags being added or removed.
   * @type {Array<string>}
   * @memberof ChangeUserTagsRequest
   */
  tags: Array<string>
}
/**
 *
 * @export
 * @interface CreateAvatarRequest
 */
export interface CreateAvatarRequest {
  /**
   *
   * @type {string}
   * @memberof CreateAvatarRequest
   */
  assetUrl?: string
  /**
   *
   * @type {string}
   * @memberof CreateAvatarRequest
   */
  assetVersion?: string
  /**
   * This can be `standalonewindows` or `android`, but can also pretty much be any random Unity verison such as `2019.2.4-801-Release` or `2019.2.2-772-Release` or even `unknownplatform`.
   * @type {string}
   * @memberof CreateAvatarRequest
   */
  platform?: string
  /**
   * A date and time of the pattern `M/d/yyyy h:mm:ss tt` (see C Sharp `System.DateTime`)
   * @type {string}
   * @memberof CreateAvatarRequest
   */
  created_at?: string
  /**
   * A date and time of the pattern `M/d/yyyy h:mm:ss tt` (see C Sharp `System.DateTime`)
   * @type {string}
   * @memberof CreateAvatarRequest
   */
  updated_at?: string
  /**
   *
   * @type {string}
   * @memberof CreateAvatarRequest
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof CreateAvatarRequest
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof CreateAvatarRequest
   */
  description?: string
  /**
   *
   * @type {Array<string>}
   * @memberof CreateAvatarRequest
   */
  tags?: Array<string>
  /**
   *
   * @type {string}
   * @memberof CreateAvatarRequest
   */
  imageUrl: string
  /**
   *
   * @type {string}
   * @memberof CreateAvatarRequest
   */
  thumbnailImageUrl?: string
  /**
   *
   * @type {ReleaseStatus}
   * @memberof CreateAvatarRequest
   */
  releaseStatus?: ReleaseStatus
  /**
   *
   * @type {number}
   * @memberof CreateAvatarRequest
   */
  version?: number
  /**
   *
   * @type {string}
   * @memberof CreateAvatarRequest
   */
  unityPackageUrl?: string
  /**
   *
   * @type {string}
   * @memberof CreateAvatarRequest
   */
  unityVersion?: string
}
/**
 *
 * @export
 * @interface CreateCalendarEventRequest
 */
export interface CreateCalendarEventRequest {
  /**
   * Event title
   * @type {string}
   * @memberof CreateCalendarEventRequest
   */
  title: string
  /**
   * Time the event starts at
   * @type {string}
   * @memberof CreateCalendarEventRequest
   */
  startsAt: string
  /**
   *
   * @type {string}
   * @memberof CreateCalendarEventRequest
   */
  description: string
  /**
   * Time the event ends at
   * @type {string}
   * @memberof CreateCalendarEventRequest
   */
  endsAt: string
  /**
   *
   * @type {string}
   * @memberof CreateCalendarEventRequest
   */
  category: string
  /**
   *
   * @type {Array<string>}
   * @memberof CreateCalendarEventRequest
   */
  tags?: Array<string>
  /**
   *
   * @type {boolean}
   * @memberof CreateCalendarEventRequest
   */
  isDraft?: boolean
  /**
   *
   * @type {string}
   * @memberof CreateCalendarEventRequest
   */
  imageId?: string
  /**
   *
   * @type {Array<string>}
   * @memberof CreateCalendarEventRequest
   */
  roleIds?: Array<string>
  /**
   *
   * @type {string}
   * @memberof CreateCalendarEventRequest
   */
  parentId?: string
  /**
   *
   * @type {Array<string>}
   * @memberof CreateCalendarEventRequest
   */
  platforms?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof CreateCalendarEventRequest
   */
  languages?: Array<string>
  /**
   * Send notification to group members.
   * @type {boolean}
   * @memberof CreateCalendarEventRequest
   */
  sendCreationNotification: boolean
  /**
   *
   * @type {boolean}
   * @memberof CreateCalendarEventRequest
   */
  featured?: boolean
  /**
   *
   * @type {number}
   * @memberof CreateCalendarEventRequest
   */
  hostEarlyJoinMinutes?: number
  /**
   *
   * @type {number}
   * @memberof CreateCalendarEventRequest
   */
  guestEarlyJoinMinutes?: number
  /**
   *
   * @type {number}
   * @memberof CreateCalendarEventRequest
   */
  closeInstanceAfterEndMinutes?: number
  /**
   *
   * @type {boolean}
   * @memberof CreateCalendarEventRequest
   */
  usesInstanceOverflow?: boolean
  /**
   *
   * @type {string}
   * @memberof CreateCalendarEventRequest
   */
  accessType: CreateCalendarEventRequestAccessTypeEnum
}

export const CreateCalendarEventRequestAccessTypeEnum = {
  Public: 'public',
  Group: 'group'
} as const

export type CreateCalendarEventRequestAccessTypeEnum =
  (typeof CreateCalendarEventRequestAccessTypeEnum)[keyof typeof CreateCalendarEventRequestAccessTypeEnum]

/**
 *
 * @export
 * @interface CreateFileRequest
 */
export interface CreateFileRequest {
  /**
   *
   * @type {string}
   * @memberof CreateFileRequest
   */
  name: string
  /**
   *
   * @type {MIMEType}
   * @memberof CreateFileRequest
   */
  mimeType: MIMEType
  /**
   *
   * @type {string}
   * @memberof CreateFileRequest
   */
  extension: string
  /**
   *
   * @type {Array<string>}
   * @memberof CreateFileRequest
   */
  tags?: Array<string>
}
/**
 *
 * @export
 * @interface CreateFileVersionRequest
 */
export interface CreateFileVersionRequest {
  /**
   *
   * @type {string}
   * @memberof CreateFileVersionRequest
   */
  signatureMd5: string
  /**
   *
   * @type {number}
   * @memberof CreateFileVersionRequest
   */
  signatureSizeInBytes: number
  /**
   *
   * @type {string}
   * @memberof CreateFileVersionRequest
   */
  fileMd5?: string
  /**
   *
   * @type {number}
   * @memberof CreateFileVersionRequest
   */
  fileSizeInBytes?: number
}
/**
 *
 * @export
 * @interface CreateGroupAnnouncementRequest
 */
export interface CreateGroupAnnouncementRequest {
  /**
   * Announcement title
   * @type {string}
   * @memberof CreateGroupAnnouncementRequest
   */
  title: string
  /**
   * Announcement text
   * @type {string}
   * @memberof CreateGroupAnnouncementRequest
   */
  text?: string
  /**
   *
   * @type {string}
   * @memberof CreateGroupAnnouncementRequest
   */
  imageId?: string
  /**
   * Send notification to group members.
   * @type {boolean}
   * @memberof CreateGroupAnnouncementRequest
   */
  sendNotification?: boolean
}
/**
 *
 * @export
 * @interface CreateGroupGalleryRequest
 */
export interface CreateGroupGalleryRequest {
  /**
   * Name of the gallery.
   * @type {string}
   * @memberof CreateGroupGalleryRequest
   */
  name: string
  /**
   * Description of the gallery.
   * @type {string}
   * @memberof CreateGroupGalleryRequest
   */
  description?: string
  /**
   * Whether the gallery is members only.
   * @type {boolean}
   * @memberof CreateGroupGalleryRequest
   */
  membersOnly?: boolean
  /**
   *
   * @type {Array<string>}
   * @memberof CreateGroupGalleryRequest
   */
  roleIdsToView?: Array<string> | null
  /**
   *
   * @type {Array<string>}
   * @memberof CreateGroupGalleryRequest
   */
  roleIdsToSubmit?: Array<string> | null
  /**
   *
   * @type {Array<string>}
   * @memberof CreateGroupGalleryRequest
   */
  roleIdsToAutoApprove?: Array<string> | null
  /**
   *
   * @type {Array<string>}
   * @memberof CreateGroupGalleryRequest
   */
  roleIdsToManage?: Array<string> | null
}
/**
 *
 * @export
 * @interface CreateGroupInviteRequest
 */
export interface CreateGroupInviteRequest {
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof CreateGroupInviteRequest
   */
  userId: string
  /**
   *
   * @type {boolean}
   * @memberof CreateGroupInviteRequest
   */
  confirmOverrideBlock?: boolean
}
/**
 *
 * @export
 * @interface CreateGroupPostRequest
 */
export interface CreateGroupPostRequest {
  /**
   * Post title
   * @type {string}
   * @memberof CreateGroupPostRequest
   */
  title: string
  /**
   * Post text
   * @type {string}
   * @memberof CreateGroupPostRequest
   */
  text: string
  /**
   *
   * @type {string}
   * @memberof CreateGroupPostRequest
   */
  imageId?: string
  /**
   * Send notification to group members.
   * @type {boolean}
   * @memberof CreateGroupPostRequest
   */
  sendNotification: boolean
  /**
   *
   * @type {Array<string>}
   * @memberof CreateGroupPostRequest
   */
  roleIds?: Array<string>
  /**
   *
   * @type {GroupPostVisibility}
   * @memberof CreateGroupPostRequest
   */
  visibility: GroupPostVisibility
}
/**
 *
 * @export
 * @interface CreateGroupRequest
 */
export interface CreateGroupRequest {
  /**
   *
   * @type {string}
   * @memberof CreateGroupRequest
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof CreateGroupRequest
   */
  shortCode: string
  /**
   *
   * @type {string}
   * @memberof CreateGroupRequest
   */
  description?: string
  /**
   *
   * @type {GroupJoinState}
   * @memberof CreateGroupRequest
   */
  joinState?: GroupJoinState
  /**
   *
   * @type {string}
   * @memberof CreateGroupRequest
   */
  iconId?: string | null
  /**
   *
   * @type {string}
   * @memberof CreateGroupRequest
   */
  bannerId?: string | null
  /**
   *
   * @type {GroupPrivacy}
   * @memberof CreateGroupRequest
   */
  privacy?: GroupPrivacy
  /**
   *
   * @type {GroupRoleTemplate}
   * @memberof CreateGroupRequest
   */
  roleTemplate: GroupRoleTemplate
}
/**
 *
 * @export
 * @interface CreateGroupRoleRequest
 */
export interface CreateGroupRoleRequest {
  /**
   *
   * @type {string}
   * @memberof CreateGroupRoleRequest
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof CreateGroupRoleRequest
   */
  name?: string
  /**
   *
   * @type {string}
   * @memberof CreateGroupRoleRequest
   */
  description?: string
  /**
   *
   * @type {boolean}
   * @memberof CreateGroupRoleRequest
   */
  isSelfAssignable?: boolean
  /**
   *
   * @type {Array<GroupPermissions>}
   * @memberof CreateGroupRoleRequest
   */
  permissions?: Array<GroupPermissions>
}
/**
 *
 * @export
 * @interface CreateInstanceRequest
 */
export interface CreateInstanceRequest {
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof CreateInstanceRequest
   */
  worldId: string
  /**
   *
   * @type {InstanceType}
   * @memberof CreateInstanceRequest
   */
  type: InstanceType
  /**
   *
   * @type {InstanceRegion}
   * @memberof CreateInstanceRequest
   */
  region: InstanceRegion
  /**
   * A groupId if the instance type is \"group\", null if instance type is public, or a userId otherwise
   * @type {string}
   * @memberof CreateInstanceRequest
   */
  ownerId?: string | null
  /**
   * Group roleIds that are allowed to join if the type is \"group\" and groupAccessType is \"member\"
   * @type {Array<string>}
   * @memberof CreateInstanceRequest
   */
  roleIds?: Array<string>
  /**
   *
   * @type {GroupAccessType}
   * @memberof CreateInstanceRequest
   */
  groupAccessType?: GroupAccessType
  /**
   *
   * @type {boolean}
   * @memberof CreateInstanceRequest
   */
  queueEnabled?: boolean
  /**
   * The time after which users won\'t be allowed to join the instance. This doesn\'t work for public instances.
   * @type {string}
   * @memberof CreateInstanceRequest
   */
  closedAt?: string
  /**
   * Only applies to invite type instances to make them invite+
   * @type {boolean}
   * @memberof CreateInstanceRequest
   */
  canRequestInvite?: boolean
  /**
   * Currently unused, but will eventually be a flag to set if the closing of the instance should kick people.
   * @type {boolean}
   * @memberof CreateInstanceRequest
   */
  hardClose?: boolean
  /**
   *
   * @type {boolean}
   * @memberof CreateInstanceRequest
   */
  inviteOnly?: boolean
  /**
   *
   * @type {boolean}
   * @memberof CreateInstanceRequest
   */
  ageGate?: boolean
  /**
   *
   * @type {boolean}
   * @memberof CreateInstanceRequest
   */
  instancePersistenceEnabled?: boolean | null
  /**
   *
   * @type {string}
   * @memberof CreateInstanceRequest
   */
  displayName?: string | null
  /**
   *
   * @type {InstanceContentSettings}
   * @memberof CreateInstanceRequest
   */
  contentSettings?: InstanceContentSettings
}
/**
 *
 * @export
 * @interface CreateWorldRequest
 */
export interface CreateWorldRequest {
  /**
   *
   * @type {string}
   * @memberof CreateWorldRequest
   */
  assetUrl: string
  /**
   *
   * @type {number}
   * @memberof CreateWorldRequest
   */
  assetVersion?: number
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof CreateWorldRequest
   */
  authorId?: string
  /**
   *
   * @type {string}
   * @memberof CreateWorldRequest
   */
  authorName?: string
  /**
   *
   * @type {number}
   * @memberof CreateWorldRequest
   */
  capacity?: number
  /**
   *
   * @type {string}
   * @memberof CreateWorldRequest
   */
  description?: string
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof CreateWorldRequest
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof CreateWorldRequest
   */
  imageUrl: string
  /**
   *
   * @type {string}
   * @memberof CreateWorldRequest
   */
  name: string
  /**
   * This can be `standalonewindows` or `android`, but can also pretty much be any random Unity verison such as `2019.2.4-801-Release` or `2019.2.2-772-Release` or even `unknownplatform`.
   * @type {string}
   * @memberof CreateWorldRequest
   */
  platform?: string
  /**
   *
   * @type {ReleaseStatus}
   * @memberof CreateWorldRequest
   */
  releaseStatus?: ReleaseStatus
  /**
   *
   * @type {Array<string>}
   * @memberof CreateWorldRequest
   */
  tags?: Array<string>
  /**
   *
   * @type {string}
   * @memberof CreateWorldRequest
   */
  unityPackageUrl?: string
  /**
   *
   * @type {string}
   * @memberof CreateWorldRequest
   */
  unityVersion?: string
}
/**
 *
 * @export
 * @interface CurrentUser
 */
export interface CurrentUser {
  /**
   *
   * @type {number}
   * @memberof CurrentUser
   */
  acceptedTOSVersion: number
  /**
   *
   * @type {number}
   * @memberof CurrentUser
   */
  acceptedPrivacyVersion?: number
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  accountDeletionDate?: string | null
  /**
   *
   * @type {Array<AccountDeletionLog>}
   * @memberof CurrentUser
   */
  accountDeletionLog?: Array<AccountDeletionLog> | null
  /**
   *
   * @type {Array<string>}
   * @memberof CurrentUser
   */
  activeFriends?: Array<string>
  /**
   *
   * @type {AgeVerificationStatus}
   * @memberof CurrentUser
   */
  ageVerificationStatus: AgeVerificationStatus
  /**
   * `true` if, user is age verified (not 18+).
   * @type {boolean}
   * @memberof CurrentUser
   */
  ageVerified: boolean
  /**
   *
   * @type {boolean}
   * @memberof CurrentUser
   */
  allowAvatarCopying: boolean
  /**
   * The auth token for NEWLY REGISTERED ACCOUNTS ONLY (/auth/register)
   * @type {string}
   * @memberof CurrentUser
   */
  authToken?: string
  /**
   *
   * @type {Array<Badge>}
   * @memberof CurrentUser
   */
  badges?: Array<Badge>
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  bio: string
  /**
   *
   * @type {Array<string>}
   * @memberof CurrentUser
   */
  bioLinks: Array<string>
  /**
   * These tags begin with `content_` and control content gating
   * @type {Array<string>}
   * @memberof CurrentUser
   */
  contentFilters?: Array<string>
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  currentAvatar: string
  /**
   * When profilePicOverride is not empty, use it instead.
   * @type {string}
   * @memberof CurrentUser
   */
  currentAvatarImageUrl: string
  /**
   * When profilePicOverride is not empty, use it instead.
   * @type {string}
   * @memberof CurrentUser
   */
  currentAvatarThumbnailImageUrl: string
  /**
   *
   * @type {Array<string>}
   * @memberof CurrentUser
   */
  currentAvatarTags: Array<string>
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  date_joined: string
  /**
   *
   * @type {DeveloperType}
   * @memberof CurrentUser
   */
  developerType: DeveloperType
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  displayName: string
  /**
   *
   * @type {boolean}
   * @memberof CurrentUser
   */
  emailVerified: boolean
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  fallbackAvatar?: string
  /**
   * Always empty array.
   * @type {Array<string>}
   * @memberof CurrentUser
   * @deprecated
   */
  friendGroupNames: Array<string>
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  friendKey: string
  /**
   *
   * @type {Array<string>}
   * @memberof CurrentUser
   */
  friends: Array<string>
  /**
   *
   * @type {boolean}
   * @memberof CurrentUser
   */
  hasBirthday: boolean
  /**
   *
   * @type {boolean}
   * @memberof CurrentUser
   */
  hideContentFilterSettings?: boolean
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  userLanguage?: string | null
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  userLanguageCode?: string | null
  /**
   *
   * @type {boolean}
   * @memberof CurrentUser
   */
  hasEmail: boolean
  /**
   *
   * @type {boolean}
   * @memberof CurrentUser
   */
  hasLoggedInFromClient: boolean
  /**
   *
   * @type {boolean}
   * @memberof CurrentUser
   */
  hasPendingEmail: boolean
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof CurrentUser
   */
  homeLocation: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof CurrentUser
   */
  id: string
  /**
   *
   * @type {boolean}
   * @memberof CurrentUser
   */
  isAdult: boolean
  /**
   *
   * @type {boolean}
   * @memberof CurrentUser
   */
  isBoopingEnabled?: boolean
  /**
   *
   * @type {boolean}
   * @memberof CurrentUser
   */
  isFriend: boolean
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  last_activity?: string
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  last_login: string
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  last_mobile: string | null
  /**
   * This can be `standalonewindows` or `android`, but can also pretty much be any random Unity verison such as `2019.2.4-801-Release` or `2019.2.2-772-Release` or even `unknownplatform`.
   * @type {string}
   * @memberof CurrentUser
   */
  last_platform: string
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  obfuscatedEmail: string
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  obfuscatedPendingEmail: string
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  oculusId: string
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  googleId?: string
  /**
   *
   * @type {object}
   * @memberof CurrentUser
   */
  googleDetails?: object
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  picoId?: string
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  viveId?: string
  /**
   *
   * @type {Array<string>}
   * @memberof CurrentUser
   */
  offlineFriends?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof CurrentUser
   */
  onlineFriends?: Array<string>
  /**
   *
   * @type {Array<PastDisplayName>}
   * @memberof CurrentUser
   */
  pastDisplayNames: Array<PastDisplayName>
  /**
   *
   * @type {CurrentUserPresence}
   * @memberof CurrentUser
   */
  presence?: CurrentUserPresence
  /**
   *
   * @type {Array<CurrentUserPlatformHistoryInner>}
   * @memberof CurrentUser
   */
  platform_history?: Array<CurrentUserPlatformHistoryInner>
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  profilePicOverride: string
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  profilePicOverrideThumbnail: string
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  pronouns: string
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  queuedInstance?: string | null
  /**
   *
   * @type {boolean}
   * @memberof CurrentUser
   */
  receiveMobileInvitations?: boolean
  /**
   *
   * @type {UserState}
   * @memberof CurrentUser
   */
  state: UserState
  /**
   *
   * @type {UserStatus}
   * @memberof CurrentUser
   */
  status: UserStatus
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  statusDescription: string
  /**
   *
   * @type {boolean}
   * @memberof CurrentUser
   */
  statusFirstTime: boolean
  /**
   *
   * @type {Array<string>}
   * @memberof CurrentUser
   */
  statusHistory: Array<string>
  /**
   *
   * @type {object}
   * @memberof CurrentUser
   */
  steamDetails: object
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  steamId: string
  /**
   *
   * @type {Array<string>}
   * @memberof CurrentUser
   */
  tags: Array<string>
  /**
   *
   * @type {boolean}
   * @memberof CurrentUser
   */
  twoFactorAuthEnabled: boolean
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  twoFactorAuthEnabledDate?: string | null
  /**
   *
   * @type {boolean}
   * @memberof CurrentUser
   */
  unsubscribe: boolean
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  updated_at?: string
  /**
   *
   * @type {string}
   * @memberof CurrentUser
   */
  userIcon: string
  /**
   * -| **DEPRECATED:** VRChat API no longer return usernames of other users. [See issue by Tupper for more information](https://github.com/pypy-vrc/VRCX/issues/429).
   * @type {string}
   * @memberof CurrentUser
   * @deprecated
   */
  username?: string
}
/**
 *
 * @export
 * @interface CurrentUserPlatformHistoryInner
 */
export interface CurrentUserPlatformHistoryInner {
  /**
   *
   * @type {boolean}
   * @memberof CurrentUserPlatformHistoryInner
   */
  isMobile?: boolean
  /**
   *
   * @type {string}
   * @memberof CurrentUserPlatformHistoryInner
   */
  platform?: string | null
  /**
   *
   * @type {string}
   * @memberof CurrentUserPlatformHistoryInner
   */
  recorded?: string
}
/**
 *
 * @export
 * @interface CurrentUserPresence
 */
export interface CurrentUserPresence {
  /**
   *
   * @type {string}
   * @memberof CurrentUserPresence
   */
  avatarThumbnail?: string | null
  /**
   *
   * @type {string}
   * @memberof CurrentUserPresence
   */
  currentAvatarTags?: string
  /**
   *
   * @type {string}
   * @memberof CurrentUserPresence
   */
  displayName?: string
  /**
   *
   * @type {string}
   * @memberof CurrentUserPresence
   */
  debugflag?: string
  /**
   *
   * @type {Array<string>}
   * @memberof CurrentUserPresence
   */
  groups?: Array<string> | null
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof CurrentUserPresence
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof CurrentUserPresence
   */
  instance?: string | null
  /**
   * either an InstanceType or an empty string
   * @type {string}
   * @memberof CurrentUserPresence
   */
  instanceType?: string | null
  /**
   *
   * @type {string}
   * @memberof CurrentUserPresence
   */
  isRejoining?: string | null
  /**
   * either a Platform or an empty string
   * @type {string}
   * @memberof CurrentUserPresence
   */
  platform?: string | null
  /**
   *
   * @type {string}
   * @memberof CurrentUserPresence
   */
  profilePicOverride?: string | null
  /**
   * either a UserStatus or empty string
   * @type {string}
   * @memberof CurrentUserPresence
   */
  status?: string | null
  /**
   *
   * @type {string}
   * @memberof CurrentUserPresence
   */
  travelingToInstance?: string | null
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof CurrentUserPresence
   */
  travelingToWorld?: string
  /**
   *
   * @type {string}
   * @memberof CurrentUserPresence
   */
  userIcon?: string | null
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof CurrentUserPresence
   */
  world?: string
}
/**
 * \"none\" User is a normal user \"trusted\" Unknown \"internal\" Is a VRChat Developer \"moderator\" Is a VRChat Moderator  Staff can hide their developerType at will.
 * @export
 * @enum {string}
 */

export const DeveloperType = {
  None: 'none',
  Trusted: 'trusted',
  Internal: 'internal',
  Moderator: 'moderator'
} as const

export type DeveloperType = (typeof DeveloperType)[keyof typeof DeveloperType]

/**
 *
 * @export
 * @interface Disable2FAResult
 */
export interface Disable2FAResult {
  /**
   *
   * @type {boolean}
   * @memberof Disable2FAResult
   */
  removed: boolean
}
/**
 *
 * @export
 * @interface DynamicContentRow
 */
export interface DynamicContentRow {
  /**
   *
   * @type {number}
   * @memberof DynamicContentRow
   */
  index?: number
  /**
   *
   * @type {string}
   * @memberof DynamicContentRow
   */
  name: string
  /**
   * Usually \"ThisPlatformSupported\", but can also be other values such as \"all\" or platform specific identifiers.
   * @type {string}
   * @memberof DynamicContentRow
   */
  platform: string
  /**
   *
   * @type {string}
   * @memberof DynamicContentRow
   */
  sortHeading: string
  /**
   *
   * @type {string}
   * @memberof DynamicContentRow
   */
  sortOrder: string
  /**
   *
   * @type {string}
   * @memberof DynamicContentRow
   */
  sortOwnership: string
  /**
   * Tag to filter content for this row.
   * @type {string}
   * @memberof DynamicContentRow
   */
  tag?: string
  /**
   * Type is not present if it is a world.
   * @type {string}
   * @memberof DynamicContentRow
   */
  type?: string
}
/**
 *
 * @export
 * @interface Favorite
 */
export interface Favorite {
  /**
   * MUST be either AvatarID, UserID or WorldID.
   * @type {string}
   * @memberof Favorite
   */
  favoriteId: string
  /**
   *
   * @type {string}
   * @memberof Favorite
   */
  id: string
  /**
   *
   * @type {Array<string>}
   * @memberof Favorite
   */
  tags: Array<string>
  /**
   *
   * @type {FavoriteType}
   * @memberof Favorite
   */
  type: FavoriteType
}
/**
 *
 * @export
 * @interface FavoriteGroup
 */
export interface FavoriteGroup {
  /**
   *
   * @type {string}
   * @memberof FavoriteGroup
   */
  displayName: string
  /**
   *
   * @type {string}
   * @memberof FavoriteGroup
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof FavoriteGroup
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof FavoriteGroup
   */
  ownerDisplayName: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof FavoriteGroup
   */
  ownerId: string
  /**
   *
   * @type {Array<string>}
   * @memberof FavoriteGroup
   */
  tags: Array<string>
  /**
   *
   * @type {FavoriteType}
   * @memberof FavoriteGroup
   */
  type: FavoriteType
  /**
   *
   * @type {FavoriteGroupVisibility}
   * @memberof FavoriteGroup
   */
  visibility: FavoriteGroupVisibility
}
/**
 *
 * @export
 * @interface FavoriteGroupLimits
 */
export interface FavoriteGroupLimits {
  /**
   *
   * @type {number}
   * @memberof FavoriteGroupLimits
   */
  avatar: number
  /**
   *
   * @type {number}
   * @memberof FavoriteGroupLimits
   */
  friend: number
  /**
   *
   * @type {number}
   * @memberof FavoriteGroupLimits
   */
  world: number
}
/**
 *
 * @export
 * @enum {string}
 */

export const FavoriteGroupVisibility = {
  Private: 'private',
  Friends: 'friends',
  Public: 'public'
} as const

export type FavoriteGroupVisibility =
  (typeof FavoriteGroupVisibility)[keyof typeof FavoriteGroupVisibility]

/**
 *
 * @export
 * @interface FavoriteLimits
 */
export interface FavoriteLimits {
  /**
   *
   * @type {number}
   * @memberof FavoriteLimits
   */
  defaultMaxFavoriteGroups: number
  /**
   *
   * @type {number}
   * @memberof FavoriteLimits
   */
  defaultMaxFavoritesPerGroup: number
  /**
   *
   * @type {FavoriteGroupLimits}
   * @memberof FavoriteLimits
   */
  maxFavoriteGroups: FavoriteGroupLimits
  /**
   *
   * @type {FavoriteGroupLimits}
   * @memberof FavoriteLimits
   */
  maxFavoritesPerGroup: FavoriteGroupLimits
}
/**
 *
 * @export
 * @enum {string}
 */

export const FavoriteType = {
  World: 'world',
  Friend: 'friend',
  Avatar: 'avatar'
} as const

export type FavoriteType = (typeof FavoriteType)[keyof typeof FavoriteType]

/**
 *
 * @export
 * @interface FavoritedWorld
 */
export interface FavoritedWorld {
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof FavoritedWorld
   */
  authorId: string
  /**
   *
   * @type {string}
   * @memberof FavoritedWorld
   */
  authorName: string
  /**
   *
   * @type {number}
   * @memberof FavoritedWorld
   */
  capacity: number
  /**
   *
   * @type {string}
   * @memberof FavoritedWorld
   */
  description: string
  /**
   *
   * @type {number}
   * @memberof FavoritedWorld
   */
  recommendedCapacity?: number
  /**
   *
   * @type {string}
   * @memberof FavoritedWorld
   */
  created_at: string
  /**
   *
   * @type {InstanceContentSettings}
   * @memberof FavoritedWorld
   */
  defaultContentSettings?: InstanceContentSettings
  /**
   *
   * @type {number}
   * @memberof FavoritedWorld
   */
  favorites: number
  /**
   *
   * @type {string}
   * @memberof FavoritedWorld
   */
  favoriteGroup: string
  /**
   *
   * @type {string}
   * @memberof FavoritedWorld
   */
  favoriteId: string
  /**
   *
   * @type {boolean}
   * @memberof FavoritedWorld
   */
  featured: boolean
  /**
   *
   * @type {number}
   * @memberof FavoritedWorld
   */
  visits?: number
  /**
   *
   * @type {number}
   * @memberof FavoritedWorld
   */
  heat: number
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof FavoritedWorld
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof FavoritedWorld
   */
  imageUrl: string
  /**
   *
   * @type {string}
   * @memberof FavoritedWorld
   */
  labsPublicationDate: string
  /**
   *
   * @type {string}
   * @memberof FavoritedWorld
   */
  name: string
  /**
   *
   * @type {number}
   * @memberof FavoritedWorld
   */
  occupants: number
  /**
   *
   * @type {string}
   * @memberof FavoritedWorld
   */
  organization: string
  /**
   *
   * @type {number}
   * @memberof FavoritedWorld
   */
  popularity: number
  /**
   *
   * @type {string}
   * @memberof FavoritedWorld
   */
  previewYoutubeId?: string | null
  /**
   *
   * @type {string}
   * @memberof FavoritedWorld
   */
  publicationDate: string
  /**
   *
   * @type {ReleaseStatus}
   * @memberof FavoritedWorld
   */
  releaseStatus: ReleaseStatus
  /**
   *
   * @type {Array<string>}
   * @memberof FavoritedWorld
   */
  tags: Array<string>
  /**
   *
   * @type {string}
   * @memberof FavoritedWorld
   */
  thumbnailImageUrl: string
  /**
   *
   * @type {Array<UnityPackage>}
   * @memberof FavoritedWorld
   */
  unityPackages: Array<UnityPackage>
  /**
   *
   * @type {string}
   * @memberof FavoritedWorld
   */
  updated_at: string
  /**
   *
   * @type {Array<string>}
   * @memberof FavoritedWorld
   */
  urlList: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof FavoritedWorld
   */
  udonProducts?: Array<string>
  /**
   *
   * @type {number}
   * @memberof FavoritedWorld
   */
  version: number
}
/**
 *
 * @export
 * @interface Feedback
 */
export interface Feedback {
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof Feedback
   */
  commenterId: string
  /**
   *
   * @type {string}
   * @memberof Feedback
   */
  commenterName: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof Feedback
   */
  contentAuthorId: string
  /**
   *
   * @type {string}
   * @memberof Feedback
   */
  contentAuthorName: string | null
  /**
   *
   * @type {string}
   * @memberof Feedback
   */
  contentId: string
  /**
   *
   * @type {string}
   * @memberof Feedback
   */
  contentName?: string
  /**
   *
   * @type {string}
   * @memberof Feedback
   */
  contentType: string
  /**
   *
   * @type {number}
   * @memberof Feedback
   */
  contentVersion: number | null
  /**
   *
   * @type {string}
   * @memberof Feedback
   */
  description?: string | null
  /**
   *
   * @type {string}
   * @memberof Feedback
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Feedback
   */
  reason: string
  /**
   *
   * @type {Array<string>}
   * @memberof Feedback
   */
  tags: Array<string>
  /**
   *
   * @type {string}
   * @memberof Feedback
   */
  type: string
}
/**
 *
 * @export
 * @interface FileAnalysis
 */
export interface FileAnalysis {
  /**
   *
   * @type {FileAnalysisAvatarStats}
   * @memberof FileAnalysis
   */
  avatarStats: FileAnalysisAvatarStats
  /**
   *
   * @type {string}
   * @memberof FileAnalysis
   */
  created_at?: string
  /**
   *
   * @type {string}
   * @memberof FileAnalysis
   */
  encryptionKey?: string
  /**
   *
   * @type {number}
   * @memberof FileAnalysis
   */
  fileSize: number
  /**
   *
   * @type {string}
   * @memberof FileAnalysis
   */
  performanceRating?: string
  /**
   *
   * @type {boolean}
   * @memberof FileAnalysis
   */
  success: boolean
  /**
   *
   * @type {number}
   * @memberof FileAnalysis
   */
  uncompressedSize: number
}
/**
 *
 * @export
 * @interface FileAnalysisAvatarStats
 */
export interface FileAnalysisAvatarStats {
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  animatorCount: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  audioSourceCount: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  blendShapeCount: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  boneCount: number
  /**
   *
   * @type {Array<number>}
   * @memberof FileAnalysisAvatarStats
   */
  bounds: Array<number>
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  cameraCount?: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  clothCount: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  constraintCount: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  contactCount: number
  /**
   *
   * @type {boolean}
   * @memberof FileAnalysisAvatarStats
   */
  customExpressions: boolean
  /**
   *
   * @type {boolean}
   * @memberof FileAnalysisAvatarStats
   */
  customizeAnimationLayers: boolean
  /**
   *
   * @type {boolean}
   * @memberof FileAnalysisAvatarStats
   */
  enableEyeLook: boolean
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  lightCount: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  lineRendererCount: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  lipSync: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  materialCount: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  materialSlotsUsed: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  meshCount: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  meshIndices: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  meshParticleMaxPolygons: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  meshPolygons: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  meshVertices: number
  /**
   *
   * @type {boolean}
   * @memberof FileAnalysisAvatarStats
   */
  particleCollisionEnabled: boolean
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  particleSystemCount: number
  /**
   *
   * @type {boolean}
   * @memberof FileAnalysisAvatarStats
   */
  particleTrailsEnabled: boolean
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  physBoneColliderCount: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  physBoneCollisionCheckCount: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  physBoneComponentCount: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  physBoneTransformCount: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  physicsColliders: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  physicsRigidbodies: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  skinnedMeshCount: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  skinnedMeshIndices: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  skinnedMeshPolygons: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  skinnedMeshVertices: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  totalClothVertices: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  totalIndices: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  totalMaxParticles: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  totalPolygons: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  totalTextureUsage: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  totalVertices: number
  /**
   *
   * @type {number}
   * @memberof FileAnalysisAvatarStats
   */
  trailRendererCount: number
  /**
   *
   * @type {boolean}
   * @memberof FileAnalysisAvatarStats
   */
  writeDefaultsUsed: boolean
}
/**
 *
 * @export
 * @interface FileData
 */
export interface FileData {
  /**
   *
   * @type {string}
   * @memberof FileData
   */
  category: FileDataCategoryEnum
  /**
   *
   * @type {string}
   * @memberof FileData
   */
  fileName: string
  /**
   *
   * @type {string}
   * @memberof FileData
   */
  md5?: string
  /**
   *
   * @type {number}
   * @memberof FileData
   */
  sizeInBytes: number
  /**
   *
   * @type {FileStatus}
   * @memberof FileData
   */
  status: FileStatus
  /**
   *
   * @type {string}
   * @memberof FileData
   */
  uploadId: string
  /**
   *
   * @type {string}
   * @memberof FileData
   */
  url: string
}

export const FileDataCategoryEnum = {
  Multipart: 'multipart',
  Queued: 'queued',
  Simple: 'simple'
} as const

export type FileDataCategoryEnum = (typeof FileDataCategoryEnum)[keyof typeof FileDataCategoryEnum]

/**
 *
 * @export
 * @enum {string}
 */

export const FileStatus = {
  Waiting: 'waiting',
  Complete: 'complete',
  None: 'none',
  Queued: 'queued'
} as const

export type FileStatus = (typeof FileStatus)[keyof typeof FileStatus]

/**
 *
 * @export
 * @interface FileUploadURL
 */
export interface FileUploadURL {
  /**
   *
   * @type {string}
   * @memberof FileUploadURL
   */
  url: string
}
/**
 *
 * @export
 * @interface FileVersion
 */
export interface FileVersion {
  /**
   *
   * @type {string}
   * @memberof FileVersion
   */
  created_at: string
  /**
   * Usually only present if `true`
   * @type {boolean}
   * @memberof FileVersion
   */
  deleted?: boolean
  /**
   *
   * @type {FileData}
   * @memberof FileVersion
   */
  delta?: FileData
  /**
   *
   * @type {FileData}
   * @memberof FileVersion
   */
  file?: FileData
  /**
   *
   * @type {FileData}
   * @memberof FileVersion
   */
  signature?: FileData
  /**
   *
   * @type {FileStatus}
   * @memberof FileVersion
   */
  status: FileStatus
  /**
   * Incremental version counter, can only be increased.
   * @type {number}
   * @memberof FileVersion
   */
  version: number
}
/**
 *
 * @export
 * @interface FileVersionUploadStatus
 */
export interface FileVersionUploadStatus {
  /**
   *
   * @type {string}
   * @memberof FileVersionUploadStatus
   */
  uploadId: string
  /**
   *
   * @type {string}
   * @memberof FileVersionUploadStatus
   */
  fileName: string
  /**
   *
   * @type {number}
   * @memberof FileVersionUploadStatus
   */
  nextPartNumber: number
  /**
   *
   * @type {number}
   * @memberof FileVersionUploadStatus
   */
  maxParts: number
  /**
   *
   * @type {Array<object>}
   * @memberof FileVersionUploadStatus
   */
  parts: Array<object>
  /**
   * Unknown
   * @type {Array<object>}
   * @memberof FileVersionUploadStatus
   */
  etags: Array<object>
}
/**
 *
 * @export
 * @interface FinishFileDataUploadRequest
 */
export interface FinishFileDataUploadRequest {
  /**
   * Array of ETags uploaded.
   * @type {Set<string>}
   * @memberof FinishFileDataUploadRequest
   */
  etags?: Set<string>
  /**
   * Always a zero in string form, despite how many parts uploaded.
   * @type {string}
   * @memberof FinishFileDataUploadRequest
   * @deprecated
   */
  nextPartNumber: string
  /**
   * Always a zero in string form, despite how many parts uploaded.
   * @type {string}
   * @memberof FinishFileDataUploadRequest
   * @deprecated
   */
  maxParts: string
}
/**
 *
 * @export
 * @interface FollowCalendarEventRequest
 */
export interface FollowCalendarEventRequest {
  /**
   *
   * @type {boolean}
   * @memberof FollowCalendarEventRequest
   */
  isFollowing: boolean
}
/**
 *
 * @export
 * @interface FriendStatus
 */
export interface FriendStatus {
  /**
   *
   * @type {boolean}
   * @memberof FriendStatus
   */
  incomingRequest: boolean
  /**
   *
   * @type {boolean}
   * @memberof FriendStatus
   */
  isFriend: boolean
  /**
   *
   * @type {boolean}
   * @memberof FriendStatus
   */
  outgoingRequest: boolean
}
/**
 *
 * @export
 * @interface GetGroupPosts200Response
 */
export interface GetGroupPosts200Response {
  /**
   *
   * @type {Array<GroupPost>}
   * @memberof GetGroupPosts200Response
   */
  posts?: Array<GroupPost>
}
/**
 *
 * @export
 * @interface GetUserGroupInstances200Response
 */
export interface GetUserGroupInstances200Response {
  /**
   *
   * @type {string}
   * @memberof GetUserGroupInstances200Response
   */
  fetchedAt?: string
  /**
   *
   * @type {Array<Instance>}
   * @memberof GetUserGroupInstances200Response
   */
  instances?: Array<Instance>
}
/**
 *
 * @export
 * @interface Group
 */
export interface Group {
  /**
   *
   * @type {boolean}
   * @memberof Group
   */
  ageVerificationSlotsAvailable?: boolean
  /**
   *
   * @type {string}
   * @memberof Group
   */
  ageVerificationBetaCode?: string
  /**
   *
   * @type {number}
   * @memberof Group
   */
  ageVerificationBetaSlots?: number
  /**
   *
   * @type {Array<string>}
   * @memberof Group
   */
  badges?: Array<string>
  /**
   *
   * @type {string}
   * @memberof Group
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof Group
   */
  name?: string
  /**
   *
   * @type {string}
   * @memberof Group
   */
  shortCode?: string
  /**
   *
   * @type {string}
   * @memberof Group
   */
  discriminator?: string
  /**
   *
   * @type {string}
   * @memberof Group
   */
  description?: string
  /**
   *
   * @type {string}
   * @memberof Group
   */
  iconUrl?: string | null
  /**
   *
   * @type {string}
   * @memberof Group
   */
  bannerUrl?: string | null
  /**
   *
   * @type {GroupPrivacy}
   * @memberof Group
   */
  privacy?: GroupPrivacy
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof Group
   */
  ownerId?: string
  /**
   *
   * @type {string}
   * @memberof Group
   */
  rules?: string | null
  /**
   *
   * @type {Array<string>}
   * @memberof Group
   */
  links?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof Group
   */
  languages?: Array<string>
  /**
   *
   * @type {string}
   * @memberof Group
   */
  iconId?: string | null
  /**
   *
   * @type {string}
   * @memberof Group
   */
  bannerId?: string | null
  /**
   *
   * @type {number}
   * @memberof Group
   */
  memberCount?: number
  /**
   *
   * @type {string}
   * @memberof Group
   */
  memberCountSyncedAt?: string
  /**
   *
   * @type {boolean}
   * @memberof Group
   */
  isVerified?: boolean
  /**
   *
   * @type {GroupJoinState}
   * @memberof Group
   */
  joinState?: GroupJoinState
  /**
   *
   * @type {Array<string>}
   * @memberof Group
   */
  tags?: Array<string>
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof Group
   */
  transferTargetId?: string
  /**
   *
   * @type {Array<GroupGallery>}
   * @memberof Group
   */
  galleries?: Array<GroupGallery>
  /**
   *
   * @type {string}
   * @memberof Group
   */
  createdAt?: string
  /**
   *
   * @type {string}
   * @memberof Group
   */
  updatedAt?: string
  /**
   *
   * @type {string}
   * @memberof Group
   */
  lastPostCreatedAt?: string | null
  /**
   *
   * @type {number}
   * @memberof Group
   */
  onlineMemberCount?: number
  /**
   *
   * @type {GroupMemberStatus}
   * @memberof Group
   */
  membershipStatus?: GroupMemberStatus
  /**
   *
   * @type {GroupMyMember}
   * @memberof Group
   */
  myMember?: GroupMyMember
  /**
   * Only returned if ?includeRoles=true is specified.
   * @type {Array<GroupRole>}
   * @memberof Group
   */
  roles?: Array<GroupRole> | null
}
/**
 * Group access type when the instance type is \"group\"
 * @export
 * @enum {string}
 */

export const GroupAccessType = {
  Public: 'public',
  Plus: 'plus',
  Members: 'members'
} as const

export type GroupAccessType = (typeof GroupAccessType)[keyof typeof GroupAccessType]

/**
 *
 * @export
 * @interface GroupAnnouncement
 */
export interface GroupAnnouncement {
  /**
   *
   * @type {string}
   * @memberof GroupAnnouncement
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof GroupAnnouncement
   */
  groupId?: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof GroupAnnouncement
   */
  authorId?: string
  /**
   *
   * @type {string}
   * @memberof GroupAnnouncement
   */
  title?: string | null
  /**
   *
   * @type {string}
   * @memberof GroupAnnouncement
   */
  text?: string | null
  /**
   *
   * @type {string}
   * @memberof GroupAnnouncement
   */
  imageId?: string
  /**
   *
   * @type {string}
   * @memberof GroupAnnouncement
   */
  imageUrl?: string | null
  /**
   *
   * @type {string}
   * @memberof GroupAnnouncement
   */
  createdAt?: string | null
  /**
   *
   * @type {string}
   * @memberof GroupAnnouncement
   */
  updatedAt?: string | null
}
/**
 *
 * @export
 * @interface GroupAuditLogEntry
 */
export interface GroupAuditLogEntry {
  /**
   *
   * @type {string}
   * @memberof GroupAuditLogEntry
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof GroupAuditLogEntry
   */
  created_at?: string
  /**
   *
   * @type {string}
   * @memberof GroupAuditLogEntry
   */
  groupId?: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof GroupAuditLogEntry
   */
  actorId?: string
  /**
   *
   * @type {string}
   * @memberof GroupAuditLogEntry
   */
  actorDisplayName?: string
  /**
   * Typically a UserID, GroupID, GroupRoleID, or Location, but could be other types of IDs.
   * @type {string}
   * @memberof GroupAuditLogEntry
   */
  targetId?: string
  /**
   * The type of event that occurred. This is a string that is prefixed with the type of object that the event occurred on. For example, a group role update event would be prefixed with `group.role`.
   * @type {string}
   * @memberof GroupAuditLogEntry
   */
  eventType?: string
  /**
   * A human-readable description of the event.
   * @type {string}
   * @memberof GroupAuditLogEntry
   */
  description?: string
  /**
   * The data associated with the event. The format of this data is dependent on the event type.
   * @type {object}
   * @memberof GroupAuditLogEntry
   */
  data?: object
}
/**
 *
 * @export
 * @interface GroupGallery
 */
export interface GroupGallery {
  /**
   *
   * @type {string}
   * @memberof GroupGallery
   */
  id?: string
  /**
   * Name of the gallery.
   * @type {string}
   * @memberof GroupGallery
   */
  name?: string
  /**
   * Description of the gallery.
   * @type {string}
   * @memberof GroupGallery
   */
  description?: string
  /**
   * Whether the gallery is members only.
   * @type {boolean}
   * @memberof GroupGallery
   */
  membersOnly?: boolean
  /**
   *
   * @type {Array<string>}
   * @memberof GroupGallery
   */
  roleIdsToView?: Array<string> | null
  /**
   *
   * @type {Array<string>}
   * @memberof GroupGallery
   */
  roleIdsToSubmit?: Array<string> | null
  /**
   *
   * @type {Array<string>}
   * @memberof GroupGallery
   */
  roleIdsToAutoApprove?: Array<string> | null
  /**
   *
   * @type {Array<string>}
   * @memberof GroupGallery
   */
  roleIdsToManage?: Array<string> | null
  /**
   *
   * @type {string}
   * @memberof GroupGallery
   */
  createdAt?: string
  /**
   *
   * @type {string}
   * @memberof GroupGallery
   */
  updatedAt?: string
}
/**
 *
 * @export
 * @interface GroupGalleryImage
 */
export interface GroupGalleryImage {
  /**
   *
   * @type {string}
   * @memberof GroupGalleryImage
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof GroupGalleryImage
   */
  groupId?: string
  /**
   *
   * @type {string}
   * @memberof GroupGalleryImage
   */
  galleryId?: string
  /**
   *
   * @type {string}
   * @memberof GroupGalleryImage
   */
  fileId?: string
  /**
   *
   * @type {string}
   * @memberof GroupGalleryImage
   */
  imageUrl?: string
  /**
   *
   * @type {string}
   * @memberof GroupGalleryImage
   */
  createdAt?: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof GroupGalleryImage
   */
  submittedByUserId?: string
  /**
   *
   * @type {boolean}
   * @memberof GroupGalleryImage
   */
  approved?: boolean
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof GroupGalleryImage
   */
  approvedByUserId?: string
  /**
   *
   * @type {string}
   * @memberof GroupGalleryImage
   */
  approvedAt?: string
}
/**
 *
 * @export
 * @interface GroupInstance
 */
export interface GroupInstance {
  /**
   *
   * @type {string}
   * @memberof GroupInstance
   */
  instanceId: string
  /**
   * InstanceID can be \"offline\" on User profiles if you are not friends with that user and \"private\" if you are friends and user is in private instance.
   * @type {string}
   * @memberof GroupInstance
   */
  location: string
  /**
   *
   * @type {World}
   * @memberof GroupInstance
   */
  world: World
  /**
   *
   * @type {number}
   * @memberof GroupInstance
   */
  memberCount: number
}
/**
 *
 * @export
 * @enum {string}
 */

export const GroupJoinRequestAction = {
  Accept: 'accept',
  Reject: 'reject'
} as const

export type GroupJoinRequestAction =
  (typeof GroupJoinRequestAction)[keyof typeof GroupJoinRequestAction]

/**
 *
 * @export
 * @enum {string}
 */

export const GroupJoinState = {
  Closed: 'closed',
  Invite: 'invite',
  Request: 'request',
  Open: 'open'
} as const

export type GroupJoinState = (typeof GroupJoinState)[keyof typeof GroupJoinState]

/**
 *
 * @export
 * @interface GroupLimitedMember
 */
export interface GroupLimitedMember {
  /**
   *
   * @type {string}
   * @memberof GroupLimitedMember
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof GroupLimitedMember
   */
  groupId?: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof GroupLimitedMember
   */
  userId?: string
  /**
   * Whether the user is representing the group. This makes the group show up above the name tag in-game.
   * @type {boolean}
   * @memberof GroupLimitedMember
   */
  isRepresenting?: boolean
  /**
   *
   * @type {Array<string>}
   * @memberof GroupLimitedMember
   */
  roleIds?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof GroupLimitedMember
   */
  mRoleIds?: Array<string>
  /**
   *
   * @type {string}
   * @memberof GroupLimitedMember
   */
  joinedAt?: string | null
  /**
   *
   * @type {GroupMemberStatus}
   * @memberof GroupLimitedMember
   */
  membershipStatus?: GroupMemberStatus
  /**
   *
   * @type {string}
   * @memberof GroupLimitedMember
   */
  visibility?: string
  /**
   *
   * @type {boolean}
   * @memberof GroupLimitedMember
   */
  isSubscribedToAnnouncements?: boolean
  /**
   * Only visible via the /groups/:groupId/members endpoint, **not** when fetching a specific user.
   * @type {string}
   * @memberof GroupLimitedMember
   */
  createdAt?: string | null
  /**
   * Only visible via the /groups/:groupId/members endpoint, **not** when fetching a specific user.
   * @type {string}
   * @memberof GroupLimitedMember
   */
  bannedAt?: string | null
  /**
   * Only visible via the /groups/:groupId/members endpoint, **not** when fetching a specific user.
   * @type {string}
   * @memberof GroupLimitedMember
   */
  managerNotes?: string | null
  /**
   *
   * @type {string}
   * @memberof GroupLimitedMember
   */
  lastPostReadAt?: string | null
  /**
   *
   * @type {boolean}
   * @memberof GroupLimitedMember
   */
  hasJoinedFromPurchase?: boolean
}
/**
 *
 * @export
 * @interface GroupMember
 */
export interface GroupMember {
  /**
   *
   * @type {string}
   * @memberof GroupMember
   */
  acceptedByDisplayName?: string | null
  /**
   *
   * @type {string}
   * @memberof GroupMember
   */
  acceptedById?: string | null
  /**
   *
   * @type {string}
   * @memberof GroupMember
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof GroupMember
   */
  groupId?: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof GroupMember
   */
  userId?: string
  /**
   * Whether the user is representing the group. This makes the group show up above the name tag in-game.
   * @type {boolean}
   * @memberof GroupMember
   */
  isRepresenting?: boolean
  /**
   *
   * @type {GroupMemberLimitedUser}
   * @memberof GroupMember
   */
  user?: GroupMemberLimitedUser
  /**
   *
   * @type {Array<string>}
   * @memberof GroupMember
   */
  roleIds?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof GroupMember
   */
  mRoleIds?: Array<string>
  /**
   *
   * @type {string}
   * @memberof GroupMember
   */
  joinedAt?: string | null
  /**
   *
   * @type {GroupMemberStatus}
   * @memberof GroupMember
   */
  membershipStatus?: GroupMemberStatus
  /**
   *
   * @type {string}
   * @memberof GroupMember
   */
  visibility?: string
  /**
   *
   * @type {boolean}
   * @memberof GroupMember
   */
  isSubscribedToAnnouncements?: boolean
  /**
   * Only visible via the /groups/:groupId/members endpoint, **not** when fetching a specific user.
   * @type {string}
   * @memberof GroupMember
   */
  createdAt?: string | null
  /**
   * Only visible via the /groups/:groupId/members endpoint, **not** when fetching a specific user.
   * @type {string}
   * @memberof GroupMember
   */
  bannedAt?: string | null
  /**
   * Only visible via the /groups/:groupId/members endpoint, **not** when fetching a specific user.
   * @type {string}
   * @memberof GroupMember
   */
  managerNotes?: string | null
  /**
   *
   * @type {string}
   * @memberof GroupMember
   */
  lastPostReadAt?: string | null
  /**
   *
   * @type {boolean}
   * @memberof GroupMember
   */
  hasJoinedFromPurchase?: boolean
}
/**
 * Only visible via the /groups/:groupId/members endpoint, **not** when fetching a specific user.
 * @export
 * @interface GroupMemberLimitedUser
 */
export interface GroupMemberLimitedUser {
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof GroupMemberLimitedUser
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof GroupMemberLimitedUser
   */
  displayName?: string
  /**
   *
   * @type {string}
   * @memberof GroupMemberLimitedUser
   */
  thumbnailUrl?: string | null
  /**
   *
   * @type {string}
   * @memberof GroupMemberLimitedUser
   */
  iconUrl?: string
  /**
   *
   * @type {string}
   * @memberof GroupMemberLimitedUser
   */
  profilePicOverride?: string
  /**
   *
   * @type {string}
   * @memberof GroupMemberLimitedUser
   */
  currentAvatarThumbnailImageUrl?: string | null
  /**
   *
   * @type {Array<string>}
   * @memberof GroupMemberLimitedUser
   */
  currentAvatarTags?: Array<string>
}
/**
 *
 * @export
 * @enum {string}
 */

export const GroupMemberStatus = {
  Inactive: 'inactive',
  Member: 'member',
  Requested: 'requested',
  Invited: 'invited',
  Banned: 'banned',
  Userblocked: 'userblocked'
} as const

export type GroupMemberStatus = (typeof GroupMemberStatus)[keyof typeof GroupMemberStatus]

/**
 *
 * @export
 * @interface GroupMyMember
 */
export interface GroupMyMember {
  /**
   *
   * @type {string}
   * @memberof GroupMyMember
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof GroupMyMember
   */
  groupId?: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof GroupMyMember
   */
  userId?: string
  /**
   *
   * @type {Array<string>}
   * @memberof GroupMyMember
   */
  roleIds?: Array<string>
  /**
   *
   * @type {string}
   * @memberof GroupMyMember
   */
  acceptedByDisplayName?: string | null
  /**
   *
   * @type {string}
   * @memberof GroupMyMember
   */
  acceptedById?: string | null
  /**
   *
   * @type {string}
   * @memberof GroupMyMember
   */
  createdAt?: string
  /**
   *
   * @type {string}
   * @memberof GroupMyMember
   */
  managerNotes?: string
  /**
   *
   * @type {string}
   * @memberof GroupMyMember
   */
  membershipStatus?: string
  /**
   *
   * @type {boolean}
   * @memberof GroupMyMember
   */
  isSubscribedToAnnouncements?: boolean
  /**
   *
   * @type {string}
   * @memberof GroupMyMember
   */
  visibility?: string
  /**
   *
   * @type {boolean}
   * @memberof GroupMyMember
   */
  isRepresenting?: boolean
  /**
   *
   * @type {string}
   * @memberof GroupMyMember
   */
  joinedAt?: string
  /**
   *
   * @type {string}
   * @memberof GroupMyMember
   */
  bannedAt?: string | null
  /**
   *
   * @type {boolean}
   * @memberof GroupMyMember
   */
  has2FA?: boolean
  /**
   *
   * @type {boolean}
   * @memberof GroupMyMember
   */
  hasJoinedFromPurchase?: boolean
  /**
   *
   * @type {string}
   * @memberof GroupMyMember
   */
  lastPostReadAt?: string | null
  /**
   *
   * @type {Array<string>}
   * @memberof GroupMyMember
   */
  mRoleIds?: Array<string>
  /**
   *
   * @type {Array<GroupPermissions>}
   * @memberof GroupMyMember
   */
  permissions?: Array<GroupPermissions>
}
/**
 * A permission that can be granted to a role in a group.
 * @export
 * @interface GroupPermission
 */
export interface GroupPermission {
  /**
   * The name of the permission.
   * @type {string}
   * @memberof GroupPermission
   */
  name?: string
  /**
   * The display name of the permission.
   * @type {string}
   * @memberof GroupPermission
   */
  displayName?: string
  /**
   * Human-readable description of the permission.
   * @type {string}
   * @memberof GroupPermission
   */
  help?: string
  /**
   * Whether this permission is a \"management\" permission.
   * @type {boolean}
   * @memberof GroupPermission
   */
  isManagementPermission?: boolean
  /**
   * Whether the user is allowed to add this permission to a role.
   * @type {boolean}
   * @memberof GroupPermission
   */
  allowedToAdd?: boolean
}
/**
 *
 * @export
 * @enum {string}
 */

export const GroupPermissions = {
  group_all: '*',
  group_announcement_manage: 'group-announcement-manage',
  group_audit_view: 'group-audit-view',
  group_bans_manage: 'group-bans-manage',
  group_data_manage: 'group-data-manage',
  group_default_role_manage: 'group-default-role-manage',
  group_galleries_manage: 'group-galleries-manage',
  group_instance_age_gated_create: 'group-instance-age-gated-create',
  group_instance_join: 'group-instance-join',
  group_instance_manage: 'group-instance-manage',
  group_instance_moderate: 'group-instance-moderate',
  group_instance_open_create: 'group-instance-open-create',
  group_instance_plus_create: 'group-instance-plus-create',
  group_instance_plus_portal: 'group-instance-plus-portal',
  group_instance_plus_portal_unlocked: 'group-instance-plus-portal-unlocked',
  group_instance_public_create: 'group-instance-public-create',
  group_instance_queue_priority: 'group-instance-queue-priority',
  group_instance_restricted_create: 'group-instance-restricted-create',
  group_invites_manage: 'group-invites-manage',
  group_members_manage: 'group-members-manage',
  group_members_remove: 'group-members-remove',
  group_members_viewall: 'group-members-viewall',
  group_roles_assign: 'group-roles-assign',
  group_roles_manage: 'group-roles-manage',
  group_calendar_manage: 'group-calendar-manage'
} as const

export type GroupPermissions = (typeof GroupPermissions)[keyof typeof GroupPermissions]

/**
 *
 * @export
 * @interface GroupPost
 */
export interface GroupPost {
  /**
   *
   * @type {string}
   * @memberof GroupPost
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof GroupPost
   */
  groupId?: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof GroupPost
   */
  authorId?: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof GroupPost
   */
  editorId?: string
  /**
   *
   * @type {GroupPostVisibility}
   * @memberof GroupPost
   */
  visibility?: GroupPostVisibility
  /**
   *
   * @type {Array<string>}
   * @memberof GroupPost
   */
  roleId?: Array<string>
  /**
   *
   * @type {string}
   * @memberof GroupPost
   */
  title?: string
  /**
   *
   * @type {string}
   * @memberof GroupPost
   */
  text?: string
  /**
   *
   * @type {string}
   * @memberof GroupPost
   */
  imageId?: string
  /**
   *
   * @type {string}
   * @memberof GroupPost
   */
  imageUrl?: string | null
  /**
   *
   * @type {string}
   * @memberof GroupPost
   */
  createdAt?: string
  /**
   *
   * @type {string}
   * @memberof GroupPost
   */
  updatedAt?: string
}
/**
 *
 * @export
 * @enum {string}
 */

export const GroupPostVisibility = {
  Group: 'group',
  Public: 'public'
} as const

export type GroupPostVisibility = (typeof GroupPostVisibility)[keyof typeof GroupPostVisibility]

/**
 *
 * @export
 * @enum {string}
 */

export const GroupPrivacy = {
  Default: 'default',
  Private: 'private'
} as const

export type GroupPrivacy = (typeof GroupPrivacy)[keyof typeof GroupPrivacy]

/**
 *
 * @export
 * @interface GroupRole
 */
export interface GroupRole {
  /**
   *
   * @type {string}
   * @memberof GroupRole
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof GroupRole
   */
  groupId?: string
  /**
   *
   * @type {string}
   * @memberof GroupRole
   */
  name?: string
  /**
   *
   * @type {string}
   * @memberof GroupRole
   */
  description?: string
  /**
   *
   * @type {boolean}
   * @memberof GroupRole
   */
  isSelfAssignable?: boolean
  /**
   *
   * @type {Array<GroupPermissions>}
   * @memberof GroupRole
   */
  permissions?: Array<GroupPermissions>
  /**
   *
   * @type {boolean}
   * @memberof GroupRole
   */
  isManagementRole?: boolean
  /**
   *
   * @type {boolean}
   * @memberof GroupRole
   */
  requiresTwoFactor?: boolean
  /**
   *
   * @type {boolean}
   * @memberof GroupRole
   */
  requiresPurchase?: boolean
  /**
   *
   * @type {number}
   * @memberof GroupRole
   */
  order?: number
  /**
   *
   * @type {string}
   * @memberof GroupRole
   */
  createdAt?: string
  /**
   *
   * @type {string}
   * @memberof GroupRole
   */
  updatedAt?: string
}
/**
 *
 * @export
 * @enum {string}
 */

export const GroupRoleTemplate = {
  Default: 'default',
  ManagedFree: 'managedFree',
  ManagedInvite: 'managedInvite',
  ManagedRequest: 'managedRequest'
} as const

export type GroupRoleTemplate = (typeof GroupRoleTemplate)[keyof typeof GroupRoleTemplate]

/**
 *
 * @export
 * @interface GroupRoleTemplateValues
 */
export interface GroupRoleTemplateValues {
  /**
   *
   * @type {Array<GroupPermissions>}
   * @memberof GroupRoleTemplateValues
   */
  basePermissions: Array<GroupPermissions>
  /**
   *
   * @type {string}
   * @memberof GroupRoleTemplateValues
   */
  description: string
  /**
   *
   * @type {string}
   * @memberof GroupRoleTemplateValues
   */
  name: string
  /**
   *
   * @type {GroupRoleTemplateValuesRoles}
   * @memberof GroupRoleTemplateValues
   */
  roles: GroupRoleTemplateValuesRoles
}
/**
 *
 * @export
 * @interface GroupRoleTemplateValuesRoles
 */
export interface GroupRoleTemplateValuesRoles {
  /**
   *
   * @type {string}
   * @memberof GroupRoleTemplateValuesRoles
   */
  description?: string
  /**
   *
   * @type {string}
   * @memberof GroupRoleTemplateValuesRoles
   */
  name?: string
  /**
   *
   * @type {Array<GroupPermissions>}
   * @memberof GroupRoleTemplateValuesRoles
   */
  basePermissions?: Array<GroupPermissions>
  /**
   *
   * @type {boolean}
   * @memberof GroupRoleTemplateValuesRoles
   */
  isAddedOnJoin?: boolean
}
/**
 *
 * @export
 * @enum {string}
 */

export const GroupSearchSort = {
  Asc: 'joinedAt:asc',
  Desc: 'joinedAt:desc'
} as const

export type GroupSearchSort = (typeof GroupSearchSort)[keyof typeof GroupSearchSort]

/**
 *
 * @export
 * @enum {string}
 */

export const GroupUserVisibility = {
  Visible: 'visible',
  Hidden: 'hidden',
  Friends: 'friends'
} as const

export type GroupUserVisibility = (typeof GroupUserVisibility)[keyof typeof GroupUserVisibility]

/**
 *
 * @export
 * @interface InfoPush
 */
export interface InfoPush {
  /**
   *
   * @type {string}
   * @memberof InfoPush
   */
  id: string
  /**
   *
   * @type {boolean}
   * @memberof InfoPush
   */
  isEnabled: boolean
  /**
   *
   * @type {ReleaseStatus}
   * @memberof InfoPush
   */
  releaseStatus: ReleaseStatus
  /**
   *
   * @type {number}
   * @memberof InfoPush
   */
  priority: number
  /**
   *
   * @type {Array<string>}
   * @memberof InfoPush
   */
  tags: Array<string>
  /**
   *
   * @type {InfoPushData}
   * @memberof InfoPush
   */
  data: InfoPushData
  /**
   * Unknown usage, MD5
   * @type {string}
   * @memberof InfoPush
   */
  hash: string
  /**
   *
   * @type {string}
   * @memberof InfoPush
   */
  createdAt: string
  /**
   *
   * @type {string}
   * @memberof InfoPush
   */
  updatedAt: string
  /**
   *
   * @type {string}
   * @memberof InfoPush
   */
  startDate?: string
  /**
   *
   * @type {string}
   * @memberof InfoPush
   */
  endDate?: string
}
/**
 *
 * @export
 * @interface InfoPushData
 */
export interface InfoPushData {
  /**
   *
   * @type {DynamicContentRow}
   * @memberof InfoPushData
   */
  contentList?: DynamicContentRow
  /**
   *
   * @type {string}
   * @memberof InfoPushData
   */
  description?: string
  /**
   *
   * @type {string}
   * @memberof InfoPushData
   */
  imageUrl?: string
  /**
   *
   * @type {string}
   * @memberof InfoPushData
   */
  name?: string
  /**
   *
   * @type {InfoPushDataClickable}
   * @memberof InfoPushData
   */
  onPressed?: InfoPushDataClickable
  /**
   *
   * @type {string}
   * @memberof InfoPushData
   */
  template?: string
  /**
   *
   * @type {string}
   * @memberof InfoPushData
   */
  version?: string
  /**
   *
   * @type {InfoPushDataArticle}
   * @memberof InfoPushData
   */
  article?: InfoPushDataArticle
}
/**
 *
 * @export
 * @interface InfoPushDataArticle
 */
export interface InfoPushDataArticle {
  /**
   *
   * @type {InfoPushDataArticleContent}
   * @memberof InfoPushDataArticle
   */
  content?: InfoPushDataArticleContent
}
/**
 *
 * @export
 * @interface InfoPushDataArticleContent
 */
export interface InfoPushDataArticleContent {
  /**
   *
   * @type {string}
   * @memberof InfoPushDataArticleContent
   */
  text?: string
  /**
   *
   * @type {string}
   * @memberof InfoPushDataArticleContent
   */
  imageUrl?: string
  /**
   *
   * @type {InfoPushDataClickable}
   * @memberof InfoPushDataArticleContent
   */
  onPressed?: InfoPushDataClickable
}
/**
 *
 * @export
 * @interface InfoPushDataClickable
 */
export interface InfoPushDataClickable {
  /**
   *
   * @type {string}
   * @memberof InfoPushDataClickable
   */
  command: InfoPushDataClickableCommandEnum
  /**
   * In case of OpenURL, this would contain the link.
   * @type {Array<string>}
   * @memberof InfoPushDataClickable
   */
  parameters?: Array<string>
}

export const InfoPushDataClickableCommandEnum = {
  OpenUrl: 'OpenURL',
  OpenVrcPlusMenu: 'OpenVRCPlusMenu',
  OpenSafetyMenu: 'OpenSafetyMenu',
  CannedWorldSearch: 'CannedWorldSearch'
} as const

export type InfoPushDataClickableCommandEnum =
  (typeof InfoPushDataClickableCommandEnum)[keyof typeof InfoPushDataClickableCommandEnum]

/**
 * * `hidden` field is only present if InstanceType is `hidden` aka \"Friends+\", and is instance creator. * `friends` field is only present if InstanceType is `friends` aka \"Friends\", and is instance creator. * `private` field is only present if InstanceType is `private` aka \"Invite\" or \"Invite+\", and is instance creator.
 * @export
 * @interface Instance
 */
export interface Instance {
  /**
   *
   * @type {boolean}
   * @memberof Instance
   */
  active: boolean
  /**
   *
   * @type {boolean}
   * @memberof Instance
   */
  ageGate?: boolean | null
  /**
   *
   * @type {boolean}
   * @memberof Instance
   */
  canRequestInvite: boolean
  /**
   *
   * @type {number}
   * @memberof Instance
   */
  capacity: number
  /**
   * Always returns \"unknown\".
   * @type {string}
   * @memberof Instance
   * @deprecated
   */
  clientNumber: string
  /**
   *
   * @type {InstanceContentSettings}
   * @memberof Instance
   */
  contentSettings: InstanceContentSettings
  /**
   *
   * @type {string}
   * @memberof Instance
   */
  displayName: string | null
  /**
   *
   * @type {boolean}
   * @memberof Instance
   */
  full: boolean
  /**
   *
   * @type {number}
   * @memberof Instance
   */
  gameServerVersion?: number
  /**
   * InstanceID can be \"offline\" on User profiles if you are not friends with that user and \"private\" if you are friends and user is in private instance.
   * @type {string}
   * @memberof Instance
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Instance
   */
  instanceId: string
  /**
   *
   * @type {string}
   * @memberof Instance
   */
  instancePersistenceEnabled: string | null
  /**
   * InstanceID can be \"offline\" on User profiles if you are not friends with that user and \"private\" if you are friends and user is in private instance.
   * @type {string}
   * @memberof Instance
   */
  location: string
  /**
   *
   * @type {number}
   * @memberof Instance
   */
  n_users: number
  /**
   *
   * @type {string}
   * @memberof Instance
   */
  name: string
  /**
   * A groupId if the instance type is \"group\", null if instance type is public, or a userId otherwise
   * @type {string}
   * @memberof Instance
   */
  ownerId?: string | null
  /**
   *
   * @type {boolean}
   * @memberof Instance
   */
  permanent: boolean
  /**
   *
   * @type {Region}
   * @memberof Instance
   */
  photonRegion: Region
  /**
   *
   * @type {InstancePlatforms}
   * @memberof Instance
   */
  platforms: InstancePlatforms
  /**
   *
   * @type {boolean}
   * @memberof Instance
   */
  playerPersistenceEnabled: boolean | null
  /**
   *
   * @type {InstanceRegion}
   * @memberof Instance
   */
  region: InstanceRegion
  /**
   *
   * @type {string}
   * @memberof Instance
   */
  secureName: string
  /**
   *
   * @type {string}
   * @memberof Instance
   */
  shortName?: string | null
  /**
   * The tags array on Instances usually contain the language tags of the people in the instance.
   * @type {Array<string>}
   * @memberof Instance
   */
  tags: Array<string>
  /**
   *
   * @type {InstanceType}
   * @memberof Instance
   */
  type: InstanceType
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof Instance
   */
  worldId: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof Instance
   */
  hidden?: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof Instance
   */
  friends?: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof Instance
   */
  private?: string
  /**
   *
   * @type {boolean}
   * @memberof Instance
   */
  queueEnabled: boolean
  /**
   *
   * @type {number}
   * @memberof Instance
   */
  queueSize: number
  /**
   *
   * @type {number}
   * @memberof Instance
   */
  recommendedCapacity: number
  /**
   *
   * @type {boolean}
   * @memberof Instance
   */
  roleRestricted?: boolean
  /**
   *
   * @type {boolean}
   * @memberof Instance
   */
  strict: boolean
  /**
   *
   * @type {number}
   * @memberof Instance
   */
  userCount: number
  /**
   *
   * @type {World}
   * @memberof Instance
   */
  world: World
  /**
   * The users field is present on instances created by the requesting user.
   * @type {Array<LimitedUserInstance>}
   * @memberof Instance
   */
  users?: Array<LimitedUserInstance>
  /**
   *
   * @type {GroupAccessType}
   * @memberof Instance
   */
  groupAccessType?: GroupAccessType
  /**
   *
   * @type {boolean}
   * @memberof Instance
   */
  hasCapacityForYou?: boolean
  /**
   *
   * @type {string}
   * @memberof Instance
   */
  nonce?: string
  /**
   *
   * @type {string}
   * @memberof Instance
   */
  closedAt?: string | null
  /**
   *
   * @type {boolean}
   * @memberof Instance
   */
  hardClose?: boolean | null
}
/**
 * Types of dynamic user content permitted in an instance
 * @export
 * @interface InstanceContentSettings
 */
export interface InstanceContentSettings {
  /**
   *
   * @type {boolean}
   * @memberof InstanceContentSettings
   */
  drones?: boolean
  /**
   *
   * @type {boolean}
   * @memberof InstanceContentSettings
   */
  emoji?: boolean
  /**
   *
   * @type {boolean}
   * @memberof InstanceContentSettings
   */
  pedestals?: boolean
  /**
   *
   * @type {boolean}
   * @memberof InstanceContentSettings
   */
  prints?: boolean
  /**
   *
   * @type {boolean}
   * @memberof InstanceContentSettings
   */
  stickers?: boolean
  /**
   *
   * @type {boolean}
   * @memberof InstanceContentSettings
   */
  props?: boolean
}
/**
 *
 * @export
 * @interface InstancePlatforms
 */
export interface InstancePlatforms {
  /**
   *
   * @type {number}
   * @memberof InstancePlatforms
   */
  android: number
  /**
   *
   * @type {number}
   * @memberof InstancePlatforms
   */
  ios?: number
  /**
   *
   * @type {number}
   * @memberof InstancePlatforms
   */
  standalonewindows: number
}
/**
 * Instance region
 * @export
 * @enum {string}
 */

export const InstanceRegion = {
  Us: 'us',
  Use: 'use',
  Eu: 'eu',
  Jp: 'jp',
  Unknown: 'unknown'
} as const

export type InstanceRegion = (typeof InstanceRegion)[keyof typeof InstanceRegion]

/**
 *
 * @export
 * @interface InstanceShortNameResponse
 */
export interface InstanceShortNameResponse {
  /**
   *
   * @type {string}
   * @memberof InstanceShortNameResponse
   */
  secureName: string
  /**
   *
   * @type {string}
   * @memberof InstanceShortNameResponse
   */
  shortName?: string | null
}
/**
 *
 * @export
 * @enum {string}
 */

export const InstanceType = {
  Public: 'public',
  Hidden: 'hidden',
  Friends: 'friends',
  Private: 'private',
  Group: 'group'
} as const

export type InstanceType = (typeof InstanceType)[keyof typeof InstanceType]

/**
 *
 * @export
 * @interface Inventory
 */
export interface Inventory {
  /**
   *
   * @type {Array<InventoryItem>}
   * @memberof Inventory
   */
  data: Array<InventoryItem>
  /**
   *
   * @type {number}
   * @memberof Inventory
   */
  totalCount: number
}
/**
 *
 * @export
 * @interface InventoryDrop
 */
export interface InventoryDrop {
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof InventoryDrop
   */
  authorId: string
  /**
   *
   * @type {string}
   * @memberof InventoryDrop
   */
  created_at: string
  /**
   *
   * @type {string}
   * @memberof InventoryDrop
   */
  dropExpiryDate: string | null
  /**
   *
   * @type {string}
   * @memberof InventoryDrop
   */
  endDropDate: string
  /**
   *
   * @type {string}
   * @memberof InventoryDrop
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof InventoryDrop
   */
  name: string
  /**
   *
   * @type {InventoryNotificationDetails}
   * @memberof InventoryDrop
   */
  notificationDetails: InventoryNotificationDetails
  /**
   *
   * @type {string}
   * @memberof InventoryDrop
   */
  startDropDate: string
  /**
   *
   * @type {string}
   * @memberof InventoryDrop
   */
  status: string
  /**
   *
   * @type {Array<string>}
   * @memberof InventoryDrop
   */
  tags: Array<string>
  /**
   *
   * @type {string}
   * @memberof InventoryDrop
   */
  targetGroup: string
  /**
   *
   * @type {Array<string>}
   * @memberof InventoryDrop
   */
  templateIds: Array<string>
  /**
   *
   * @type {string}
   * @memberof InventoryDrop
   */
  updated_at: string
}
/**
 *
 * @export
 * @interface InventoryItem
 */
export interface InventoryItem {
  /**
   *
   * @type {Array<string>}
   * @memberof InventoryItem
   */
  collections: Array<string>
  /**
   *
   * @type {string}
   * @memberof InventoryItem
   */
  created_at: string
  /**
   *
   * @type {string}
   * @memberof InventoryItem
   */
  description: string
  /**
   *
   * @type {string}
   * @memberof InventoryItem
   */
  expiryDate: string | null
  /**
   *
   * @type {Array<string>}
   * @memberof InventoryItem
   */
  flags: Array<string>
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof InventoryItem
   */
  holderId: string
  /**
   *
   * @type {string}
   * @memberof InventoryItem
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof InventoryItem
   */
  imageUrl: string
  /**
   *
   * @type {boolean}
   * @memberof InventoryItem
   */
  isArchived: boolean
  /**
   *
   * @type {boolean}
   * @memberof InventoryItem
   */
  isSeen: boolean
  /**
   *
   * @type {InventoryItemType}
   * @memberof InventoryItem
   */
  itemType: InventoryItemType
  /**
   *
   * @type {string}
   * @memberof InventoryItem
   */
  itemTypeLabel: string
  /**
   *
   * @type {InventoryMetadata}
   * @memberof InventoryItem
   */
  metadata: InventoryMetadata
  /**
   *
   * @type {string}
   * @memberof InventoryItem
   */
  name: string
  /**
   *
   * @type {Array<string>}
   * @memberof InventoryItem
   */
  tags: Array<string>
  /**
   *
   * @type {string}
   * @memberof InventoryItem
   */
  templateId: string
  /**
   *
   * @type {string}
   * @memberof InventoryItem
   */
  template_created_at: string
  /**
   *
   * @type {string}
   * @memberof InventoryItem
   */
  template_updated_at: string
  /**
   *
   * @type {string}
   * @memberof InventoryItem
   */
  updated_at: string
}
/**
 *
 * @export
 * @enum {string}
 */

export const InventoryItemType = {
  Bundle: 'bundle',
  Prop: 'prop',
  Emoji: 'emoji',
  Sticker: 'sticker'
} as const

export type InventoryItemType = (typeof InventoryItemType)[keyof typeof InventoryItemType]

/**
 *
 * @export
 * @interface InventoryMetadata
 */
export interface InventoryMetadata {
  [key: string]: any

  /**
   * Only in bundles
   * @type {Array<string>}
   * @memberof InventoryMetadata
   */
  inventoryItemsToInstantiate?: Array<string>
  /**
   *
   * @type {boolean}
   * @memberof InventoryMetadata
   */
  animated?: boolean
  /**
   *
   * @type {string}
   * @memberof InventoryMetadata
   */
  animationStyle?: string
  /**
   *
   * @type {string}
   * @memberof InventoryMetadata
   */
  assetBundleId?: string
  /**
   *
   * @type {string}
   * @memberof InventoryMetadata
   */
  fileId?: string
  /**
   *
   * @type {string}
   * @memberof InventoryMetadata
   */
  imageUrl?: string
  /**
   *
   * @type {string}
   * @memberof InventoryMetadata
   */
  maskTag?: string
  /**
   *
   * @type {string}
   * @memberof InventoryMetadata
   */
  propId?: string
}
/**
 *
 * @export
 * @interface InventoryNotificationDetails
 */
export interface InventoryNotificationDetails {
  /**
   *
   * @type {string}
   * @memberof InventoryNotificationDetails
   */
  body: string
  /**
   *
   * @type {string}
   * @memberof InventoryNotificationDetails
   */
  imageUrl: string
  /**
   *
   * @type {string}
   * @memberof InventoryNotificationDetails
   */
  title: string
}
/**
 *
 * @export
 * @interface InventorySpawn
 */
export interface InventorySpawn {
  /**
   *
   * @type {string}
   * @memberof InventorySpawn
   */
  token: string
  /**
   *
   * @type {number}
   * @memberof InventorySpawn
   */
  version: number
}
/**
 *
 * @export
 * @interface InventoryTemplate
 */
export interface InventoryTemplate {
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof InventoryTemplate
   */
  authorId: string
  /**
   *
   * @type {Array<string>}
   * @memberof InventoryTemplate
   */
  collections: Array<string>
  /**
   *
   * @type {string}
   * @memberof InventoryTemplate
   */
  created_at: string
  /**
   *
   * @type {string}
   * @memberof InventoryTemplate
   */
  description: string
  /**
   *
   * @type {Array<string>}
   * @memberof InventoryTemplate
   */
  flags: Array<string>
  /**
   *
   * @type {string}
   * @memberof InventoryTemplate
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof InventoryTemplate
   */
  imageUrl: string
  /**
   *
   * @type {InventoryItemType}
   * @memberof InventoryTemplate
   */
  itemType: InventoryItemType
  /**
   *
   * @type {string}
   * @memberof InventoryTemplate
   */
  itemTypeLabel: string
  /**
   *
   * @type {InventoryMetadata}
   * @memberof InventoryTemplate
   */
  metadata?: InventoryMetadata
  /**
   *
   * @type {string}
   * @memberof InventoryTemplate
   */
  name: string
  /**
   *
   * @type {InventoryNotificationDetails}
   * @memberof InventoryTemplate
   */
  notificationDetails?: InventoryNotificationDetails
  /**
   *
   * @type {string}
   * @memberof InventoryTemplate
   */
  status: string
  /**
   *
   * @type {Array<string>}
   * @memberof InventoryTemplate
   */
  tags: Array<string>
  /**
   *
   * @type {string}
   * @memberof InventoryTemplate
   */
  updated_at: string
}
/**
 *
 * @export
 * @interface InviteMessage
 */
export interface InviteMessage {
  /**
   *
   * @type {boolean}
   * @memberof InviteMessage
   */
  canBeUpdated: boolean
  /**
   *
   * @type {string}
   * @memberof InviteMessage
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof InviteMessage
   */
  message: string
  /**
   *
   * @type {InviteMessageType}
   * @memberof InviteMessage
   */
  messageType: InviteMessageType
  /**
   * Changes to 60 when updated, although probably server-side configurable.
   * @type {number}
   * @memberof InviteMessage
   */
  remainingCooldownMinutes: number
  /**
   *
   * @type {number}
   * @memberof InviteMessage
   */
  slot: number
  /**
   *
   * @type {string}
   * @memberof InviteMessage
   */
  updatedAt: string
}
/**
 *
 * @export
 * @enum {string}
 */

export const InviteMessageType = {
  Message: 'message',
  Response: 'response',
  Request: 'request',
  RequestResponse: 'requestResponse'
} as const

export type InviteMessageType = (typeof InviteMessageType)[keyof typeof InviteMessageType]

/**
 *
 * @export
 * @interface InviteRequest
 */
export interface InviteRequest {
  /**
   * InstanceID can be \"offline\" on User profiles if you are not friends with that user and \"private\" if you are friends and user is in private instance.
   * @type {string}
   * @memberof InviteRequest
   */
  instanceId: string
  /**
   *
   * @type {number}
   * @memberof InviteRequest
   */
  messageSlot?: number
}
/**
 *
 * @export
 * @interface InviteResponse
 */
export interface InviteResponse {
  /**
   *
   * @type {number}
   * @memberof InviteResponse
   */
  responseSlot: number
}
/**
 *
 * @export
 * @interface Jam
 */
export interface Jam {
  /**
   *
   * @type {string}
   * @memberof Jam
   */
  description: string
  /**
   *
   * @type {string}
   * @memberof Jam
   */
  id: string
  /**
   *
   * @type {boolean}
   * @memberof Jam
   */
  isVisible: boolean
  /**
   *
   * @type {string}
   * @memberof Jam
   */
  moreInfo: string
  /**
   * One of: - submissions_open - closed
   * @type {string}
   * @memberof Jam
   */
  state: string
  /**
   *
   * @type {JamStateChangeDates}
   * @memberof Jam
   */
  stateChangeDates: JamStateChangeDates
  /**
   *
   * @type {string}
   * @memberof Jam
   */
  submissionContentGateDate: string | null
  /**
   *
   * @type {boolean}
   * @memberof Jam
   */
  submissionContentGated: boolean
  /**
   *
   * @type {string}
   * @memberof Jam
   */
  title: string
  /**
   *
   * @type {string}
   * @memberof Jam
   */
  updated_at: string
}
/**
 *
 * @export
 * @interface JamStateChangeDates
 */
export interface JamStateChangeDates {
  /**
   *
   * @type {string}
   * @memberof JamStateChangeDates
   */
  closed?: string | null
  /**
   *
   * @type {string}
   * @memberof JamStateChangeDates
   */
  submissionsClosed?: string | null
  /**
   *
   * @type {string}
   * @memberof JamStateChangeDates
   */
  submissionsOpened?: string | null
  /**
   *
   * @type {string}
   * @memberof JamStateChangeDates
   */
  winnersSelected?: string | null
}
/**
 *
 * @export
 * @interface License
 */
export interface License {
  /**
   * Either a AvatarID, LicenseGroupID, PermissionID or ProductID. This depends on the `forType` field.
   * @type {string}
   * @memberof License
   */
  forId: string
  /**
   *
   * @type {LicenseType}
   * @memberof License
   */
  forType: LicenseType
  /**
   *
   * @type {string}
   * @memberof License
   */
  forName: string
  /**
   *
   * @type {LicenseAction}
   * @memberof License
   */
  forAction: LicenseAction
}
/**
 *
 * @export
 * @enum {string}
 */

export const LicenseAction = {
  Wear: 'wear',
  Have: 'have'
} as const

export type LicenseAction = (typeof LicenseAction)[keyof typeof LicenseAction]

/**
 *
 * @export
 * @interface LicenseGroup
 */
export interface LicenseGroup {
  /**
   *
   * @type {string}
   * @memberof LicenseGroup
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof LicenseGroup
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof LicenseGroup
   */
  description: string
  /**
   *
   * @type {Array<License>}
   * @memberof LicenseGroup
   */
  licenses: Array<License>
}
/**
 *
 * @export
 * @enum {string}
 */

export const LicenseType = {
  Avatar: 'avatar',
  LicenseGroup: 'licenseGroup',
  Permission: 'permission',
  Product: 'product'
} as const

export type LicenseType = (typeof LicenseType)[keyof typeof LicenseType]

/**
 *
 * @export
 * @interface LimitedGroup
 */
export interface LimitedGroup {
  /**
   *
   * @type {string}
   * @memberof LimitedGroup
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof LimitedGroup
   */
  name?: string
  /**
   *
   * @type {string}
   * @memberof LimitedGroup
   */
  shortCode?: string
  /**
   *
   * @type {string}
   * @memberof LimitedGroup
   */
  discriminator?: string
  /**
   *
   * @type {string}
   * @memberof LimitedGroup
   */
  description?: string
  /**
   *
   * @type {string}
   * @memberof LimitedGroup
   */
  iconUrl?: string | null
  /**
   *
   * @type {string}
   * @memberof LimitedGroup
   */
  bannerUrl?: string | null
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof LimitedGroup
   */
  ownerId?: string
  /**
   *
   * @type {string}
   * @memberof LimitedGroup
   */
  rules?: string | null
  /**
   *
   * @type {string}
   * @memberof LimitedGroup
   */
  iconId?: string | null
  /**
   *
   * @type {string}
   * @memberof LimitedGroup
   */
  bannerId?: string | null
  /**
   *
   * @type {number}
   * @memberof LimitedGroup
   */
  memberCount?: number
  /**
   *
   * @type {Array<string>}
   * @memberof LimitedGroup
   */
  tags?: Array<string>
  /**
   *
   * @type {string}
   * @memberof LimitedGroup
   */
  createdAt?: string
  /**
   *
   * @type {GroupMemberStatus}
   * @memberof LimitedGroup
   */
  membershipStatus?: GroupMemberStatus
  /**
   *
   * @type {boolean}
   * @memberof LimitedGroup
   */
  isSearchable?: boolean
  /**
   *
   * @type {Array<GroupGallery>}
   * @memberof LimitedGroup
   */
  galleries?: Array<GroupGallery>
}
/**
 *
 * @export
 * @interface LimitedUnityPackage
 */
export interface LimitedUnityPackage {
  /**
   * This can be `standalonewindows` or `android`, but can also pretty much be any random Unity verison such as `2019.2.4-801-Release` or `2019.2.2-772-Release` or even `unknownplatform`.
   * @type {string}
   * @memberof LimitedUnityPackage
   */
  platform: string
  /**
   *
   * @type {string}
   * @memberof LimitedUnityPackage
   */
  unityVersion: string
}
/**
 * User object received when querying your friends list
 * @export
 * @interface LimitedUserFriend
 */
export interface LimitedUserFriend {
  /**
   *
   * @type {string}
   * @memberof LimitedUserFriend
   */
  bio?: string
  /**
   *
   * @type {Array<string>}
   * @memberof LimitedUserFriend
   */
  bioLinks?: Array<string>
  /**
   * When profilePicOverride is not empty, use it instead.
   * @type {string}
   * @memberof LimitedUserFriend
   */
  currentAvatarImageUrl: string
  /**
   * When profilePicOverride is not empty, use it instead.
   * @type {string}
   * @memberof LimitedUserFriend
   */
  currentAvatarThumbnailImageUrl?: string
  /**
   *
   * @type {Array<string>}
   * @memberof LimitedUserFriend
   */
  currentAvatarTags?: Array<string>
  /**
   *
   * @type {DeveloperType}
   * @memberof LimitedUserFriend
   */
  developerType: DeveloperType
  /**
   *
   * @type {string}
   * @memberof LimitedUserFriend
   */
  displayName: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserFriend
   */
  friendKey: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof LimitedUserFriend
   */
  id: string
  /**
   *
   * @type {boolean}
   * @memberof LimitedUserFriend
   */
  isFriend: boolean
  /**
   *
   * @type {string}
   * @memberof LimitedUserFriend
   */
  imageUrl: string
  /**
   * This can be `standalonewindows` or `android`, but can also pretty much be any random Unity verison such as `2019.2.4-801-Release` or `2019.2.2-772-Release` or even `unknownplatform`.
   * @type {string}
   * @memberof LimitedUserFriend
   */
  last_platform: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserFriend
   */
  location: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserFriend
   */
  last_login: string | null
  /**
   *
   * @type {string}
   * @memberof LimitedUserFriend
   */
  last_activity: string | null
  /**
   *
   * @type {string}
   * @memberof LimitedUserFriend
   */
  last_mobile: string | null
  /**
   *
   * @type {string}
   * @memberof LimitedUserFriend
   */
  platform: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserFriend
   */
  profilePicOverride: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserFriend
   */
  profilePicOverrideThumbnail: string
  /**
   *
   * @type {UserStatus}
   * @memberof LimitedUserFriend
   */
  status: UserStatus
  /**
   *
   * @type {string}
   * @memberof LimitedUserFriend
   */
  statusDescription: string
  /**
   * <- Always empty.
   * @type {Array<string>}
   * @memberof LimitedUserFriend
   */
  tags: Array<string>
  /**
   *
   * @type {string}
   * @memberof LimitedUserFriend
   */
  userIcon: string
}
/**
 *
 * @export
 * @interface LimitedUserGroups
 */
export interface LimitedUserGroups {
  /**
   *
   * @type {string}
   * @memberof LimitedUserGroups
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserGroups
   */
  name?: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserGroups
   */
  shortCode?: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserGroups
   */
  discriminator?: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserGroups
   */
  description?: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserGroups
   */
  iconId?: string | null
  /**
   *
   * @type {string}
   * @memberof LimitedUserGroups
   */
  iconUrl?: string | null
  /**
   *
   * @type {string}
   * @memberof LimitedUserGroups
   */
  bannerId?: string | null
  /**
   *
   * @type {string}
   * @memberof LimitedUserGroups
   */
  bannerUrl?: string | null
  /**
   *
   * @type {string}
   * @memberof LimitedUserGroups
   */
  privacy?: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserGroups
   */
  lastPostCreatedAt?: string | null
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof LimitedUserGroups
   */
  ownerId?: string
  /**
   *
   * @type {number}
   * @memberof LimitedUserGroups
   */
  memberCount?: number
  /**
   *
   * @type {string}
   * @memberof LimitedUserGroups
   */
  groupId?: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserGroups
   */
  memberVisibility?: string
  /**
   *
   * @type {boolean}
   * @memberof LimitedUserGroups
   */
  isRepresenting?: boolean
  /**
   *
   * @type {boolean}
   * @memberof LimitedUserGroups
   */
  mutualGroup?: boolean
  /**
   *
   * @type {string}
   * @memberof LimitedUserGroups
   */
  lastPostReadAt?: string | null
}
/**
 * User object received when querying your own instance
 * @export
 * @interface LimitedUserInstance
 */
export interface LimitedUserInstance {
  /**
   *
   * @type {AgeVerificationStatus}
   * @memberof LimitedUserInstance
   */
  ageVerificationStatus: AgeVerificationStatus
  /**
   * `true` if, user is age verified (not 18+).
   * @type {boolean}
   * @memberof LimitedUserInstance
   */
  ageVerified: boolean
  /**
   *
   * @type {boolean}
   * @memberof LimitedUserInstance
   */
  allowAvatarCopying: boolean
  /**
   *
   * @type {string}
   * @memberof LimitedUserInstance
   */
  bio?: string
  /**
   *
   * @type {Array<string>}
   * @memberof LimitedUserInstance
   */
  bioLinks?: Array<string>
  /**
   * When profilePicOverride is not empty, use it instead.
   * @type {string}
   * @memberof LimitedUserInstance
   */
  currentAvatarImageUrl: string
  /**
   * When profilePicOverride is not empty, use it instead.
   * @type {string}
   * @memberof LimitedUserInstance
   */
  currentAvatarThumbnailImageUrl: string
  /**
   *
   * @type {Array<string>}
   * @memberof LimitedUserInstance
   */
  currentAvatarTags: Array<string>
  /**
   *
   * @type {string}
   * @memberof LimitedUserInstance
   */
  date_joined: string | null
  /**
   *
   * @type {DeveloperType}
   * @memberof LimitedUserInstance
   */
  developerType: DeveloperType
  /**
   *
   * @type {string}
   * @memberof LimitedUserInstance
   */
  displayName: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserInstance
   */
  friendKey: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof LimitedUserInstance
   */
  id: string
  /**
   *
   * @type {boolean}
   * @memberof LimitedUserInstance
   */
  isFriend: boolean
  /**
   *
   * @type {string}
   * @memberof LimitedUserInstance
   */
  imageUrl?: string
  /**
   * This can be `standalonewindows` or `android`, but can also pretty much be any random Unity verison such as `2019.2.4-801-Release` or `2019.2.2-772-Release` or even `unknownplatform`.
   * @type {string}
   * @memberof LimitedUserInstance
   */
  last_platform: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserInstance
   */
  last_activity: string | null
  /**
   *
   * @type {string}
   * @memberof LimitedUserInstance
   */
  last_mobile: string | null
  /**
   *
   * @type {string}
   * @memberof LimitedUserInstance
   */
  platform?: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserInstance
   */
  profilePicOverride: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserInstance
   */
  profilePicOverrideThumbnail: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserInstance
   */
  pronouns: string
  /**
   *
   * @type {UserState}
   * @memberof LimitedUserInstance
   */
  state: UserState
  /**
   *
   * @type {UserStatus}
   * @memberof LimitedUserInstance
   */
  status: UserStatus
  /**
   *
   * @type {string}
   * @memberof LimitedUserInstance
   */
  statusDescription: string
  /**
   *
   * @type {Array<string>}
   * @memberof LimitedUserInstance
   */
  tags: Array<string>
  /**
   *
   * @type {string}
   * @memberof LimitedUserInstance
   */
  userIcon: string
}
/**
 * User object received when searching
 * @export
 * @interface LimitedUserSearch
 */
export interface LimitedUserSearch {
  /**
   *
   * @type {string}
   * @memberof LimitedUserSearch
   */
  bio?: string
  /**
   *
   * @type {Array<string>}
   * @memberof LimitedUserSearch
   */
  bioLinks?: Array<string>
  /**
   * When profilePicOverride is not empty, use it instead.
   * @type {string}
   * @memberof LimitedUserSearch
   */
  currentAvatarImageUrl: string
  /**
   * When profilePicOverride is not empty, use it instead.
   * @type {string}
   * @memberof LimitedUserSearch
   */
  currentAvatarThumbnailImageUrl: string
  /**
   *
   * @type {Array<string>}
   * @memberof LimitedUserSearch
   */
  currentAvatarTags: Array<string>
  /**
   *
   * @type {DeveloperType}
   * @memberof LimitedUserSearch
   */
  developerType: DeveloperType
  /**
   *
   * @type {string}
   * @memberof LimitedUserSearch
   */
  displayName: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof LimitedUserSearch
   */
  id: string
  /**
   *
   * @type {boolean}
   * @memberof LimitedUserSearch
   */
  isFriend: boolean
  /**
   * This can be `standalonewindows` or `android`, but can also pretty much be any random Unity verison such as `2019.2.4-801-Release` or `2019.2.2-772-Release` or even `unknownplatform`.
   * @type {string}
   * @memberof LimitedUserSearch
   */
  last_platform: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserSearch
   */
  profilePicOverride: string
  /**
   *
   * @type {string}
   * @memberof LimitedUserSearch
   */
  pronouns?: string
  /**
   *
   * @type {UserStatus}
   * @memberof LimitedUserSearch
   */
  status: UserStatus
  /**
   *
   * @type {string}
   * @memberof LimitedUserSearch
   */
  statusDescription: string
  /**
   * <- Always empty.
   * @type {Array<string>}
   * @memberof LimitedUserSearch
   */
  tags: Array<string>
  /**
   *
   * @type {string}
   * @memberof LimitedUserSearch
   */
  userIcon: string
}
/**
 *
 * @export
 * @interface LimitedWorld
 */
export interface LimitedWorld {
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof LimitedWorld
   */
  authorId: string
  /**
   *
   * @type {string}
   * @memberof LimitedWorld
   */
  authorName: string
  /**
   *
   * @type {number}
   * @memberof LimitedWorld
   */
  capacity: number
  /**
   *
   * @type {number}
   * @memberof LimitedWorld
   */
  recommendedCapacity?: number
  /**
   *
   * @type {string}
   * @memberof LimitedWorld
   */
  created_at: string
  /**
   *
   * @type {InstanceContentSettings}
   * @memberof LimitedWorld
   */
  defaultContentSettings?: InstanceContentSettings
  /**
   *
   * @type {number}
   * @memberof LimitedWorld
   */
  favorites: number
  /**
   *
   * @type {number}
   * @memberof LimitedWorld
   */
  visits?: number
  /**
   *
   * @type {number}
   * @memberof LimitedWorld
   */
  heat: number
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof LimitedWorld
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof LimitedWorld
   */
  imageUrl: string
  /**
   *
   * @type {string}
   * @memberof LimitedWorld
   */
  labsPublicationDate: string
  /**
   *
   * @type {string}
   * @memberof LimitedWorld
   */
  name: string
  /**
   *
   * @type {number}
   * @memberof LimitedWorld
   */
  occupants: number
  /**
   *
   * @type {string}
   * @memberof LimitedWorld
   */
  organization: string
  /**
   *
   * @type {number}
   * @memberof LimitedWorld
   */
  popularity: number
  /**
   *
   * @type {string}
   * @memberof LimitedWorld
   */
  previewYoutubeId?: string | null
  /**
   *
   * @type {string}
   * @memberof LimitedWorld
   */
  publicationDate: string
  /**
   *
   * @type {ReleaseStatus}
   * @memberof LimitedWorld
   */
  releaseStatus: ReleaseStatus
  /**
   *
   * @type {string}
   * @memberof LimitedWorld
   */
  storeId?: string
  /**
   *
   * @type {Array<string>}
   * @memberof LimitedWorld
   */
  tags: Array<string>
  /**
   *
   * @type {string}
   * @memberof LimitedWorld
   */
  thumbnailImageUrl: string
  /**
   *
   * @type {Array<LimitedUnityPackage>}
   * @memberof LimitedWorld
   */
  unityPackages: Array<LimitedUnityPackage>
  /**
   *
   * @type {string}
   * @memberof LimitedWorld
   */
  updated_at: string
  /**
   *
   * @type {Array<string>}
   * @memberof LimitedWorld
   */
  udonProducts?: Array<string>
}
/**
 *
 * @export
 * @enum {string}
 */

export const MIMEType = {
  ImageJpeg: 'image/jpeg',
  ImageJpg: 'image/jpg',
  ImagePng: 'image/png',
  ImageWebp: 'image/webp',
  ImageGif: 'image/gif',
  ImageBmp: 'image/bmp',
  ImageSvgxml: 'image/svg＋xml',
  ImageTiff: 'image/tiff',
  ApplicationXAvatar: 'application/x-avatar',
  ApplicationXWorld: 'application/x-world',
  ApplicationGzip: 'application/gzip',
  ApplicationXRsyncSignature: 'application/x-rsync-signature',
  ApplicationXRsyncDelta: 'application/x-rsync-delta',
  ApplicationOctetStream: 'application/octet-stream'
} as const

export type MIMEType = (typeof MIMEType)[keyof typeof MIMEType]

/**
 *
 * @export
 * @interface ModelError
 */
export interface ModelError {
  /**
   *
   * @type {Response}
   * @memberof ModelError
   */
  error?: Response
}
/**
 *
 * @export
 * @interface ModelFile
 */
export interface ModelFile {
  /**
   *
   * @type {string}
   * @memberof ModelFile
   */
  animationStyle?: string
  /**
   *
   * @type {string}
   * @memberof ModelFile
   */
  maskTag?: string
  /**
   *
   * @type {string}
   * @memberof ModelFile
   */
  extension: string
  /**
   *
   * @type {string}
   * @memberof ModelFile
   */
  id: string
  /**
   *
   * @type {MIMEType}
   * @memberof ModelFile
   */
  mimeType: MIMEType
  /**
   *
   * @type {string}
   * @memberof ModelFile
   */
  name: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof ModelFile
   */
  ownerId: string
  /**
   *
   * @type {Array<string>}
   * @memberof ModelFile
   */
  tags: Array<string>
  /**
   *
   * @type {Set<FileVersion>}
   * @memberof ModelFile
   */
  versions: Set<FileVersion>
}
/**
 *
 * @export
 * @interface ModerateUserRequest
 */
export interface ModerateUserRequest {
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof ModerateUserRequest
   */
  moderated: string
  /**
   *
   * @type {PlayerModerationType}
   * @memberof ModerateUserRequest
   */
  type: PlayerModerationType
}
/**
 *
 * @export
 * @interface Notification
 */
export interface Notification {
  /**
   *
   * @type {string}
   * @memberof Notification
   */
  created_at: string
  /**
   * **NOTICE:** This is not a JSON object when received from the REST API, but it is when received from the Websocket API. When received from the REST API, this is a json **encoded** object, meaning you have to json-de-encode to get the NotificationDetail object depending on the NotificationType.
   * @type {string}
   * @memberof Notification
   */
  details: string
  /**
   *
   * @type {string}
   * @memberof Notification
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Notification
   */
  message: string
  /**
   * Not included in notification objects received from the Websocket API
   * @type {boolean}
   * @memberof Notification
   */
  seen?: boolean
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof Notification
   */
  receiverUserId?: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof Notification
   */
  senderUserId: string
  /**
   * -| **DEPRECATED:** VRChat API no longer return usernames of other users. [See issue by Tupper for more information](https://github.com/pypy-vrc/VRCX/issues/429).
   * @type {string}
   * @memberof Notification
   * @deprecated
   */
  senderUsername?: string
  /**
   *
   * @type {NotificationType}
   * @memberof Notification
   */
  type: NotificationType
}
/**
 *
 * @export
 * @interface NotificationDetailInvite
 */
export interface NotificationDetailInvite {
  /**
   *
   * @type {string}
   * @memberof NotificationDetailInvite
   */
  inviteMessage?: string
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof NotificationDetailInvite
   */
  worldId: string
  /**
   *
   * @type {string}
   * @memberof NotificationDetailInvite
   */
  worldName: string
  /**
   *
   * @type {string}
   * @memberof NotificationDetailInvite
   */
  imageUrl?: string
}
/**
 *
 * @export
 * @interface NotificationDetailInviteResponse
 */
export interface NotificationDetailInviteResponse {
  /**
   *
   * @type {string}
   * @memberof NotificationDetailInviteResponse
   */
  inResponseTo: string
  /**
   *
   * @type {string}
   * @memberof NotificationDetailInviteResponse
   */
  responseMessage: string
}
/**
 *
 * @export
 * @interface NotificationDetailRequestInvite
 */
export interface NotificationDetailRequestInvite {
  /**
   * TODO: Does this still exist?
   * @type {string}
   * @memberof NotificationDetailRequestInvite
   */
  platform?: string
  /**
   * Used when using InviteMessage Slot.
   * @type {string}
   * @memberof NotificationDetailRequestInvite
   */
  requestMessage?: string
}
/**
 *
 * @export
 * @interface NotificationDetailRequestInviteResponse
 */
export interface NotificationDetailRequestInviteResponse {
  /**
   *
   * @type {string}
   * @memberof NotificationDetailRequestInviteResponse
   */
  inResponseTo: string
  /**
   * Used when using InviteMessage Slot.
   * @type {string}
   * @memberof NotificationDetailRequestInviteResponse
   */
  requestMessage?: string
}
/**
 *
 * @export
 * @interface NotificationDetailVoteToKick
 */
export interface NotificationDetailVoteToKick {
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof NotificationDetailVoteToKick
   */
  initiatorUserId: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof NotificationDetailVoteToKick
   */
  userToKickId: string
}
/**
 *
 * @export
 * @enum {string}
 */

export const NotificationType = {
  FriendRequest: 'friendRequest',
  Invite: 'invite',
  InviteResponse: 'inviteResponse',
  Message: 'message',
  RequestInvite: 'requestInvite',
  RequestInviteResponse: 'requestInviteResponse',
  Votetokick: 'votetokick'
} as const

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

/**
 *
 * @export
 * @enum {string}
 */

export const OrderOption = {
  Ascending: 'ascending',
  Descending: 'descending'
} as const

export type OrderOption = (typeof OrderOption)[keyof typeof OrderOption]

/**
 *
 * @export
 * @interface PaginatedCalendarEventList
 */
export interface PaginatedCalendarEventList {
  /**
   *
   * @type {Array<CalendarEvent>}
   * @memberof PaginatedCalendarEventList
   */
  results?: Array<CalendarEvent>
  /**
   * The total number of results that the query would return if there were no pagination.
   * @type {number}
   * @memberof PaginatedCalendarEventList
   */
  totalCount?: number
  /**
   * Whether there are more results after this page.
   * @type {boolean}
   * @memberof PaginatedCalendarEventList
   */
  hasNext?: boolean
}
/**
 *
 * @export
 * @interface PaginatedGroupAuditLogEntryList
 */
export interface PaginatedGroupAuditLogEntryList {
  /**
   *
   * @type {Array<GroupAuditLogEntry>}
   * @memberof PaginatedGroupAuditLogEntryList
   */
  results?: Array<GroupAuditLogEntry>
  /**
   * The total number of results that the query would return if there were no pagination.
   * @type {number}
   * @memberof PaginatedGroupAuditLogEntryList
   */
  totalCount?: number
  /**
   * Whether there are more results after this page.
   * @type {boolean}
   * @memberof PaginatedGroupAuditLogEntryList
   */
  hasNext?: boolean
}
/**
 *
 * @export
 * @interface PastDisplayName
 */
export interface PastDisplayName {
  /**
   *
   * @type {string}
   * @memberof PastDisplayName
   */
  displayName: string
  /**
   *
   * @type {string}
   * @memberof PastDisplayName
   */
  updated_at: string
}
/**
 *
 * @export
 * @interface Pending2FAResult
 */
export interface Pending2FAResult {
  /**
   *
   * @type {string}
   * @memberof Pending2FAResult
   */
  qrCodeDataUrl: string
  /**
   *
   * @type {string}
   * @memberof Pending2FAResult
   */
  secret: string
}
/**
 * Info about the performance limits on a platform
 * @export
 * @interface PerformanceLimiterInfo
 */
export interface PerformanceLimiterInfo {
  /**
   * Maximum amount of seats. -1 means no limit.
   * @type {number}
   * @memberof PerformanceLimiterInfo
   */
  maxSeats: number
}
/**
 * Avatar Performance ratings.
 * @export
 * @enum {string}
 */

export const PerformanceRatings = {
  None: 'None',
  Excellent: 'Excellent',
  Good: 'Good',
  Medium: 'Medium',
  Poor: 'Poor',
  VeryPoor: 'VeryPoor'
} as const

export type PerformanceRatings = (typeof PerformanceRatings)[keyof typeof PerformanceRatings]

/**
 *
 * @export
 * @interface Permission
 */
export interface Permission {
  /**
   *
   * @type {string}
   * @memberof Permission
   */
  displayName?: string
  /**
   *
   * @type {string}
   * @memberof Permission
   */
  description?: string
  /**
   *
   * @type {string}
   * @memberof Permission
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Permission
   */
  ownerDisplayName: string
  /**
   *
   * @type {string}
   * @memberof Permission
   */
  name: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof Permission
   */
  ownerId: string
  /**
   *
   * @type {string}
   * @memberof Permission
   */
  type?: string
  /**
   *
   * @type {object}
   * @memberof Permission
   */
  data?: object
}
/**
 * Build information for a platform
 * @export
 * @interface PlatformBuildInfo
 */
export interface PlatformBuildInfo {
  /**
   * Minimum build number required for the platform
   * @type {number}
   * @memberof PlatformBuildInfo
   */
  minBuildNumber: number
  /**
   * Redirection URL for updating the app
   * @type {string}
   * @memberof PlatformBuildInfo
   */
  redirectionAddress?: string
}
/**
 *
 * @export
 * @interface PlayerModeration
 */
export interface PlayerModeration {
  /**
   *
   * @type {string}
   * @memberof PlayerModeration
   */
  created: string
  /**
   *
   * @type {string}
   * @memberof PlayerModeration
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof PlayerModeration
   */
  sourceDisplayName: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof PlayerModeration
   */
  sourceUserId: string
  /**
   *
   * @type {string}
   * @memberof PlayerModeration
   */
  targetDisplayName: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof PlayerModeration
   */
  targetUserId: string
  /**
   *
   * @type {PlayerModerationType}
   * @memberof PlayerModeration
   */
  type: PlayerModerationType
}
/**
 *
 * @export
 * @enum {string}
 */

export const PlayerModerationType = {
  Mute: 'mute',
  Unmute: 'unmute',
  Block: 'block',
  Unblock: 'unblock',
  InteractOn: 'interactOn',
  InteractOff: 'interactOff'
} as const

export type PlayerModerationType = (typeof PlayerModerationType)[keyof typeof PlayerModerationType]

/**
 * Info about a print
 * @export
 * @interface Print
 */
export interface Print {
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof Print
   */
  authorId: string
  /**
   *
   * @type {string}
   * @memberof Print
   */
  authorName: string
  /**
   *
   * @type {string}
   * @memberof Print
   */
  createdAt: string
  /**
   *
   * @type {PrintFiles}
   * @memberof Print
   */
  files: PrintFiles
  /**
   *
   * @type {string}
   * @memberof Print
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Print
   */
  note: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof Print
   */
  ownerId?: string
  /**
   *
   * @type {string}
   * @memberof Print
   */
  timestamp: string
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof Print
   */
  worldId: string
  /**
   *
   * @type {string}
   * @memberof Print
   */
  worldName: string
}
/**
 *
 * @export
 * @interface PrintFiles
 */
export interface PrintFiles {
  /**
   *
   * @type {string}
   * @memberof PrintFiles
   */
  fileId?: string
  /**
   * Link to file, e.g. https://api.vrchat.cloud/api/1/file/file_66fe782d-f2bd-4462-9761-1d766d7b2b26/1/file
   * @type {string}
   * @memberof PrintFiles
   */
  image?: string
}
/**
 *
 * @export
 * @interface Product
 */
export interface Product {
  /**
   *
   * @type {boolean}
   * @memberof Product
   */
  archived: boolean
  /**
   *
   * @type {string}
   * @memberof Product
   */
  created: string
  /**
   *
   * @type {string}
   * @memberof Product
   */
  description: string
  /**
   *
   * @type {string}
   * @memberof Product
   */
  displayName: string
  /**
   *
   * @type {boolean}
   * @memberof Product
   */
  groupAccess?: boolean
  /**
   *
   * @type {boolean}
   * @memberof Product
   */
  groupAccessRemove?: boolean
  /**
   *
   * @type {string}
   * @memberof Product
   */
  groupId?: string
  /**
   *
   * @type {string}
   * @memberof Product
   */
  groupRoleId?: string
  /**
   *
   * @type {string}
   * @memberof Product
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Product
   */
  imageId: string
  /**
   *
   * @type {Array<string>}
   * @memberof Product
   */
  parentListings: Array<string>
  /**
   *
   * @type {ProductType}
   * @memberof Product
   */
  productType: ProductType
  /**
   *
   * @type {string}
   * @memberof Product
   */
  sellerDisplayName: string
  /**
   *
   * @type {string}
   * @memberof Product
   */
  sellerId: string
  /**
   *
   * @type {Array<string>}
   * @memberof Product
   */
  tags: Array<string>
  /**
   *
   * @type {string}
   * @memberof Product
   */
  updated: string | null
  /**
   *
   * @type {boolean}
   * @memberof Product
   */
  useForSubscriberList?: boolean
}
/**
 *
 * @export
 * @interface ProductListing
 */
export interface ProductListing {
  /**
   *
   * @type {boolean}
   * @memberof ProductListing
   */
  active: boolean
  /**
   *
   * @type {boolean}
   * @memberof ProductListing
   */
  archived: boolean
  /**
   *
   * @type {boolean}
   * @memberof ProductListing
   */
  buyerRefundable: boolean
  /**
   *
   * @type {string}
   * @memberof ProductListing
   */
  created: string
  /**
   *
   * @type {string}
   * @memberof ProductListing
   */
  description: string
  /**
   *
   * @type {string}
   * @memberof ProductListing
   */
  displayName: string
  /**
   *
   * @type {number}
   * @memberof ProductListing
   */
  duration?: number
  /**
   *
   * @type {string}
   * @memberof ProductListing
   */
  durationType?: string
  /**
   *
   * @type {string}
   * @memberof ProductListing
   */
  groupIcon: string
  /**
   *
   * @type {string}
   * @memberof ProductListing
   */
  groupId: string
  /**
   *
   * @type {string}
   * @memberof ProductListing
   */
  groupName: string
  /**
   *
   * @type {Array<Product>}
   * @memberof ProductListing
   */
  hydratedProducts?: Array<Product>
  /**
   *
   * @type {string}
   * @memberof ProductListing
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof ProductListing
   */
  imageId: string
  /**
   *
   * @type {boolean}
   * @memberof ProductListing
   */
  instant: boolean
  /**
   *
   * @type {ProductListingType}
   * @memberof ProductListing
   */
  listingType: ProductListingType
  /**
   *
   * @type {Array<ProductListingVariant>}
   * @memberof ProductListing
   */
  listingVariants: Array<ProductListingVariant>
  /**
   *
   * @type {boolean}
   * @memberof ProductListing
   */
  permanent: boolean
  /**
   *
   * @type {number}
   * @memberof ProductListing
   */
  priceTokens: number
  /**
   *
   * @type {Array<string>}
   * @memberof ProductListing
   */
  productIds: Array<string>
  /**
   *
   * @type {ProductType}
   * @memberof ProductListing
   */
  productType: ProductType
  /**
   *
   * @type {Array<object>}
   * @memberof ProductListing
   */
  products: Array<object>
  /**
   *
   * @type {boolean}
   * @memberof ProductListing
   */
  quantifiable?: boolean
  /**
   *
   * @type {boolean}
   * @memberof ProductListing
   */
  recurrable: boolean
  /**
   *
   * @type {boolean}
   * @memberof ProductListing
   */
  refundable: boolean
  /**
   *
   * @type {string}
   * @memberof ProductListing
   */
  sellerDisplayName: string
  /**
   *
   * @type {string}
   * @memberof ProductListing
   */
  sellerId: string
  /**
   *
   * @type {boolean}
   * @memberof ProductListing
   */
  stackable: boolean
  /**
   *
   * @type {Array<string>}
   * @memberof ProductListing
   */
  storeIds: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof ProductListing
   */
  tags: Array<string>
  /**
   *
   * @type {string}
   * @memberof ProductListing
   */
  updated: string | null
}
/**
 *
 * @export
 * @enum {string}
 */

export const ProductListingType = {
  Subscription: 'subscription'
} as const

export type ProductListingType = (typeof ProductListingType)[keyof typeof ProductListingType]

/**
 *
 * @export
 * @interface ProductListingVariant
 */
export interface ProductListingVariant {
  /**
   *
   * @type {string}
   * @memberof ProductListingVariant
   */
  effectiveFrom?: string
  /**
   *
   * @type {string}
   * @memberof ProductListingVariant
   */
  listingVariantId: string
  /**
   *
   * @type {boolean}
   * @memberof ProductListingVariant
   */
  nonRefundable: boolean
  /**
   *
   * @type {number}
   * @memberof ProductListingVariant
   */
  quantity: number
  /**
   *
   * @type {boolean}
   * @memberof ProductListingVariant
   */
  sellerVariant: boolean
  /**
   *
   * @type {number}
   * @memberof ProductListingVariant
   */
  unitPriceTokens: number
}
/**
 *
 * @export
 * @enum {string}
 */

export const ProductType = {
  Listing: 'listing',
  Role: 'role',
  Udon: 'udon'
} as const

export type ProductType = (typeof ProductType)[keyof typeof ProductType]

/**
 *
 * @export
 * @interface Prop
 */
export interface Prop {
  /**
   *
   * @type {string}
   * @memberof Prop
   */
  _created_at: string
  /**
   *
   * @type {string}
   * @memberof Prop
   */
  _updated_at: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof Prop
   */
  authorId: string
  /**
   *
   * @type {string}
   * @memberof Prop
   */
  authorName: string
  /**
   *
   * @type {string}
   * @memberof Prop
   */
  description: string
  /**
   *
   * @type {string}
   * @memberof Prop
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Prop
   */
  imageUrl: string
  /**
   *
   * @type {number}
   * @memberof Prop
   */
  maxCountPerUser: number
  /**
   *
   * @type {string}
   * @memberof Prop
   */
  name: string
  /**
   *
   * @type {ReleaseStatus}
   * @memberof Prop
   */
  releaseStatus: ReleaseStatus
  /**
   *
   * @type {number}
   * @memberof Prop
   */
  spawnType: number
  /**
   *
   * @type {Array<string>}
   * @memberof Prop
   */
  tags: Array<string>
  /**
   *
   * @type {string}
   * @memberof Prop
   */
  thumbnailImageUrl: string
  /**
   *
   * @type {string}
   * @memberof Prop
   */
  unityPackageUrl: string | null
  /**
   *
   * @type {Set<PropUnityPackage>}
   * @memberof Prop
   */
  unityPackages: Set<PropUnityPackage>
  /**
   *
   * @type {number}
   * @memberof Prop
   */
  worldPlacementMask: number
}
/**
 *
 * @export
 * @interface PropUnityPackage
 */
export interface PropUnityPackage {
  /**
   *
   * @type {string}
   * @memberof PropUnityPackage
   */
  assetUrl: string
  /**
   *
   * @type {number}
   * @memberof PropUnityPackage
   */
  assetVersion: number
  /**
   *
   * @type {string}
   * @memberof PropUnityPackage
   */
  propSignature: string
  /**
   * This can be `standalonewindows` or `android`, but can also pretty much be any random Unity verison such as `2019.2.4-801-Release` or `2019.2.2-772-Release` or even `unknownplatform`.
   * @type {string}
   * @memberof PropUnityPackage
   */
  platform: string
  /**
   *
   * @type {string}
   * @memberof PropUnityPackage
   */
  unityVersion: string
  /**
   *
   * @type {string}
   * @memberof PropUnityPackage
   */
  variant: string
}
/**
 * API/Photon region.
 * @export
 * @enum {string}
 */

export const Region = {
  Us: 'us',
  Use: 'use',
  Usw: 'usw',
  Usx: 'usx',
  Eu: 'eu',
  Jp: 'jp',
  Unknown: 'unknown'
} as const

export type Region = (typeof Region)[keyof typeof Region]

/**
 *
 * @export
 * @interface RegisterUserAccountRequest
 */
export interface RegisterUserAccountRequest {
  /**
   * Display Name / Username (Username is a sanitized version)
   * @type {string}
   * @memberof RegisterUserAccountRequest
   */
  username: string
  /**
   * Password
   * @type {string}
   * @memberof RegisterUserAccountRequest
   */
  password: string
  /**
   * Email address
   * @type {string}
   * @memberof RegisterUserAccountRequest
   */
  email: string
  /**
   * Birth year
   * @type {string}
   * @memberof RegisterUserAccountRequest
   */
  year: string
  /**
   * Birth month of year
   * @type {string}
   * @memberof RegisterUserAccountRequest
   */
  month: string
  /**
   * Birth day of month
   * @type {string}
   * @memberof RegisterUserAccountRequest
   */
  day: string
  /**
   * Captcha code
   * @type {string}
   * @memberof RegisterUserAccountRequest
   */
  captchaCode: string
  /**
   * Whether to recieve promotional emails
   * @type {boolean}
   * @memberof RegisterUserAccountRequest
   */
  subscribe: boolean
  /**
   * The most recent version of the TOS
   * @type {number}
   * @memberof RegisterUserAccountRequest
   */
  acceptedTOSVersion: number
}
/**
 *
 * @export
 * @enum {string}
 */

export const ReleaseStatus = {
  Public: 'public',
  Private: 'private',
  Hidden: 'hidden',
  All: 'all'
} as const

export type ReleaseStatus = (typeof ReleaseStatus)[keyof typeof ReleaseStatus]

/**
 * A category used for reporting content
 * @export
 * @interface ReportCategory
 */
export interface ReportCategory {
  /**
   * The description of the report category
   * @type {string}
   * @memberof ReportCategory
   */
  description?: string
  /**
   * The title of the report category
   * @type {string}
   * @memberof ReportCategory
   */
  title?: string
  /**
   * The label of the report category
   * @type {string}
   * @memberof ReportCategory
   */
  text: string
  /**
   * The tooltip that describes the category
   * @type {string}
   * @memberof ReportCategory
   */
  tooltip: string
}
/**
 * A reason used for reporting users
 * @export
 * @interface ReportReason
 */
export interface ReportReason {
  /**
   * The label or name of the report reason
   * @type {string}
   * @memberof ReportReason
   */
  text: string
  /**
   * A brief explanation of what this reason entails
   * @type {string}
   * @memberof ReportReason
   */
  tooltip: string
}
/**
 *
 * @export
 * @interface RepresentedGroup
 */
export interface RepresentedGroup {
  /**
   *
   * @type {string}
   * @memberof RepresentedGroup
   */
  name?: string
  /**
   *
   * @type {string}
   * @memberof RepresentedGroup
   */
  shortCode?: string
  /**
   *
   * @type {string}
   * @memberof RepresentedGroup
   */
  discriminator?: string
  /**
   *
   * @type {string}
   * @memberof RepresentedGroup
   */
  description?: string
  /**
   *
   * @type {string}
   * @memberof RepresentedGroup
   */
  iconId?: string | null
  /**
   *
   * @type {string}
   * @memberof RepresentedGroup
   */
  iconUrl?: string | null
  /**
   *
   * @type {string}
   * @memberof RepresentedGroup
   */
  bannerId?: string | null
  /**
   *
   * @type {string}
   * @memberof RepresentedGroup
   */
  bannerUrl?: string | null
  /**
   *
   * @type {GroupPrivacy}
   * @memberof RepresentedGroup
   */
  privacy?: GroupPrivacy
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof RepresentedGroup
   */
  ownerId?: string
  /**
   *
   * @type {number}
   * @memberof RepresentedGroup
   */
  memberCount?: number
  /**
   *
   * @type {string}
   * @memberof RepresentedGroup
   */
  groupId?: string
  /**
   *
   * @type {GroupUserVisibility}
   * @memberof RepresentedGroup
   */
  memberVisibility?: GroupUserVisibility
  /**
   *
   * @type {boolean}
   * @memberof RepresentedGroup
   */
  isRepresenting?: boolean
}
/**
 *
 * @export
 * @interface RequestInviteRequest
 */
export interface RequestInviteRequest {
  /**
   *
   * @type {number}
   * @memberof RequestInviteRequest
   */
  requestSlot?: number
}
/**
 *
 * @export
 * @interface RespondGroupJoinRequest
 */
export interface RespondGroupJoinRequest {
  /**
   *
   * @type {GroupJoinRequestAction}
   * @memberof RespondGroupJoinRequest
   */
  action: GroupJoinRequestAction
  /**
   * Whether to block the user from requesting again
   * @type {boolean}
   * @memberof RespondGroupJoinRequest
   */
  block?: boolean
}
/**
 *
 * @export
 * @interface Response
 */
export interface Response {
  /**
   *
   * @type {string}
   * @memberof Response
   */
  message?: string
  /**
   *
   * @type {number}
   * @memberof Response
   */
  status_code: number
}
/**
 *
 * @export
 * @interface SentNotification
 */
export interface SentNotification {
  /**
   *
   * @type {string}
   * @memberof SentNotification
   */
  created_at: string
  /**
   *
   * @type {object}
   * @memberof SentNotification
   */
  details: object
  /**
   *
   * @type {string}
   * @memberof SentNotification
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof SentNotification
   */
  message: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof SentNotification
   */
  receiverUserId: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof SentNotification
   */
  senderUserId: string
  /**
   * -| **DEPRECATED:** VRChat API no longer return usernames of other users. [See issue by Tupper for more information](https://github.com/pypy-vrc/VRCX/issues/429).
   * @type {string}
   * @memberof SentNotification
   * @deprecated
   */
  senderUsername?: string
  /**
   *
   * @type {NotificationType}
   * @memberof SentNotification
   */
  type: NotificationType
}
/**
 * Statistics about the user\'s currently queued service request
 * @export
 * @interface ServiceQueueStats
 */
export interface ServiceQueueStats {
  /**
   *
   * @type {number}
   * @memberof ServiceQueueStats
   */
  estimatedServiceDurationSeconds: number
}
/**
 * Status information for a service request
 * @export
 * @interface ServiceStatus
 */
export interface ServiceStatus {
  /**
   *
   * @type {string}
   * @memberof ServiceStatus
   */
  created_at: string
  /**
   * The id of this service, NOT the id of the thing this service was requested for.
   * @type {string}
   * @memberof ServiceStatus
   */
  id: string
  /**
   *
   * @type {Array<object>}
   * @memberof ServiceStatus
   */
  progress: Array<object>
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof ServiceStatus
   */
  requesterUserId: string
  /**
   *
   * @type {string}
   * @memberof ServiceStatus
   */
  state: string
  /**
   * The id of the thing this service was requested for.
   * @type {string}
   * @memberof ServiceStatus
   */
  subjectId: string
  /**
   * The kind of the thing this service was requested for.
   * @type {string}
   * @memberof ServiceStatus
   */
  subjectType: string
  /**
   * The kind of service that was requested.
   * @type {string}
   * @memberof ServiceStatus
   */
  type: string
  /**
   *
   * @type {string}
   * @memberof ServiceStatus
   */
  updated_at: string
}
/**
 *
 * @export
 * @enum {string}
 */

export const SortOption = {
  Popularity: 'popularity',
  Heat: 'heat',
  Trust: 'trust',
  Shuffle: 'shuffle',
  Random: 'random',
  Favorites: 'favorites',
  ReportScore: 'reportScore',
  ReportCount: 'reportCount',
  PublicationDate: 'publicationDate',
  LabsPublicationDate: 'labsPublicationDate',
  Created: 'created',
  CreatedAt: '_created_at',
  Updated: 'updated',
  UpdatedAt: '_updated_at',
  Order: 'order',
  Relevance: 'relevance',
  Magic: 'magic',
  Name: 'name'
} as const

export type SortOption = (typeof SortOption)[keyof typeof SortOption]

/**
 *
 * @export
 * @interface Submission
 */
export interface Submission {
  /**
   * Either world ID or avatar ID
   * @type {string}
   * @memberof Submission
   */
  contentId: string
  /**
   *
   * @type {string}
   * @memberof Submission
   */
  created_at: string
  /**
   *
   * @type {string}
   * @memberof Submission
   */
  description: string
  /**
   *
   * @type {string}
   * @memberof Submission
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Submission
   */
  jamId: string
  /**
   *
   * @type {number}
   * @memberof Submission
   */
  ratingScore?: number
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof Submission
   */
  submitterId: string
}
/**
 *
 * @export
 * @interface Subscription
 */
export interface Subscription {
  /**
   *
   * @type {string}
   * @memberof Subscription
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Subscription
   */
  steamItemId: string
  /**
   *
   * @type {string}
   * @memberof Subscription
   */
  oculusSku?: string
  /**
   *
   * @type {string}
   * @memberof Subscription
   */
  googleProductId?: string
  /**
   *
   * @type {string}
   * @memberof Subscription
   */
  googlePlanId?: string
  /**
   *
   * @type {string}
   * @memberof Subscription
   */
  picoSku?: string
  /**
   *
   * @type {string}
   * @memberof Subscription
   */
  appleProductId?: string
  /**
   *
   * @type {number}
   * @memberof Subscription
   */
  amount: number
  /**
   *
   * @type {string}
   * @memberof Subscription
   */
  description: string
  /**
   *
   * @type {SubscriptionPeriod}
   * @memberof Subscription
   */
  period: SubscriptionPeriod
  /**
   *
   * @type {number}
   * @memberof Subscription
   */
  tier: number
}
/**
 *
 * @export
 * @enum {string}
 */

export const SubscriptionPeriod = {
  Hour: 'hour',
  Day: 'day',
  Week: 'week',
  Month: 'month',
  Year: 'year'
} as const

export type SubscriptionPeriod = (typeof SubscriptionPeriod)[keyof typeof SubscriptionPeriod]

/**
 *
 * @export
 * @interface Success
 */
export interface Success {
  /**
   *
   * @type {Response}
   * @memberof Success
   */
  success?: Response
}
/**
 *
 * @export
 * @interface TiliaStatus
 */
export interface TiliaStatus {
  /**
   *
   * @type {boolean}
   * @memberof TiliaStatus
   */
  economyOnline: boolean
  /**
   *
   * @type {number}
   * @memberof TiliaStatus
   */
  economyState?: number
  /**
   *
   * @type {string}
   * @memberof TiliaStatus
   */
  plannedOfflineWindowStart?: string
  /**
   *
   * @type {string}
   * @memberof TiliaStatus
   */
  plannedOfflineWindowEnd?: string
}
/**
 *
 * @export
 * @interface TiliaTOS
 */
export interface TiliaTOS {
  /**
   *
   * @type {boolean}
   * @memberof TiliaTOS
   */
  signed_tos: boolean
}
/**
 *
 * @export
 * @interface TokenBundle
 */
export interface TokenBundle {
  /**
   *
   * @type {string}
   * @memberof TokenBundle
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof TokenBundle
   */
  steamItemId: string
  /**
   *
   * @type {string}
   * @memberof TokenBundle
   */
  oculusSku: string
  /**
   *
   * @type {string}
   * @memberof TokenBundle
   */
  googleProductId?: string
  /**
   * price of the bundle
   * @type {number}
   * @memberof TokenBundle
   */
  amount: number
  /**
   *
   * @type {string}
   * @memberof TokenBundle
   */
  description: string
  /**
   * number of tokens received
   * @type {number}
   * @memberof TokenBundle
   */
  tokens: number
  /**
   * direct url to image
   * @type {string}
   * @memberof TokenBundle
   */
  imageUrl: string
}
/**
 *
 * @export
 * @interface Transaction
 */
export interface Transaction {
  /**
   *
   * @type {string}
   * @memberof Transaction
   */
  id: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof Transaction
   */
  userId?: string
  /**
   *
   * @type {string}
   * @memberof Transaction
   */
  userDisplayName?: string
  /**
   *
   * @type {TransactionStatus}
   * @memberof Transaction
   */
  status: TransactionStatus
  /**
   *
   * @type {Subscription}
   * @memberof Transaction
   */
  subscription: Subscription
  /**
   *
   * @type {boolean}
   * @memberof Transaction
   */
  sandbox: boolean
  /**
   *
   * @type {string}
   * @memberof Transaction
   */
  created_at: string
  /**
   *
   * @type {string}
   * @memberof Transaction
   */
  updated_at: string
  /**
   *
   * @type {TransactionSteamInfo}
   * @memberof Transaction
   */
  steam?: TransactionSteamInfo
  /**
   *
   * @type {TransactionAgreement}
   * @memberof Transaction
   */
  agreement?: TransactionAgreement
  /**
   *
   * @type {string}
   * @memberof Transaction
   */
  error: string
  /**
   *
   * @type {boolean}
   * @memberof Transaction
   */
  isGift?: boolean
  /**
   *
   * @type {boolean}
   * @memberof Transaction
   */
  isTokens?: boolean
}
/**
 * Represents a single Transaction, which is likely between VRChat and Steam.
 * @export
 * @interface TransactionAgreement
 */
export interface TransactionAgreement {
  /**
   *
   * @type {string}
   * @memberof TransactionAgreement
   */
  agreementId: string
  /**
   *
   * @type {number}
   * @memberof TransactionAgreement
   */
  itemId: number
  /**
   *
   * @type {string}
   * @memberof TransactionAgreement
   */
  agreement: string
  /**
   * This is NOT TransactionStatus, but whatever Steam return.
   * @type {string}
   * @memberof TransactionAgreement
   */
  status: string
  /**
   *
   * @type {string}
   * @memberof TransactionAgreement
   */
  period: string
  /**
   *
   * @type {number}
   * @memberof TransactionAgreement
   */
  frequency: number
  /**
   *
   * @type {string}
   * @memberof TransactionAgreement
   */
  billingType: string
  /**
   *
   * @type {string}
   * @memberof TransactionAgreement
   */
  startDate: string
  /**
   *
   * @type {string}
   * @memberof TransactionAgreement
   */
  endDate: string
  /**
   *
   * @type {number}
   * @memberof TransactionAgreement
   */
  recurringAmt: number
  /**
   *
   * @type {string}
   * @memberof TransactionAgreement
   */
  currency: string
  /**
   *
   * @type {string}
   * @memberof TransactionAgreement
   */
  timeCreated: string
  /**
   *
   * @type {string}
   * @memberof TransactionAgreement
   */
  nextPayment: string
  /**
   *
   * @type {string}
   * @memberof TransactionAgreement
   */
  lastPayment: string
  /**
   *
   * @type {number}
   * @memberof TransactionAgreement
   */
  lastAmount: number
  /**
   *
   * @type {number}
   * @memberof TransactionAgreement
   */
  lastAmountVat: number
  /**
   *
   * @type {number}
   * @memberof TransactionAgreement
   */
  outstanding: number
  /**
   *
   * @type {number}
   * @memberof TransactionAgreement
   */
  failedAttempts: number
}
/**
 *
 * @export
 * @enum {string}
 */

export const TransactionStatus = {
  Active: 'active',
  Failed: 'failed',
  Expired: 'expired',
  Chargeback: 'chargeback'
} as const

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus]

/**
 *
 * @export
 * @interface TransactionSteamInfo
 */
export interface TransactionSteamInfo {
  /**
   *
   * @type {TransactionSteamWalletInfo}
   * @memberof TransactionSteamInfo
   */
  walletInfo: TransactionSteamWalletInfo
  /**
   * Steam User ID
   * @type {string}
   * @memberof TransactionSteamInfo
   */
  steamId: string
  /**
   * Steam Order ID
   * @type {string}
   * @memberof TransactionSteamInfo
   */
  orderId: string
  /**
   * Empty
   * @type {string}
   * @memberof TransactionSteamInfo
   */
  steamUrl: string
  /**
   * Steam Transaction ID, NOT the same as VRChat TransactionID
   * @type {string}
   * @memberof TransactionSteamInfo
   */
  transId: string
}
/**
 *
 * @export
 * @interface TransactionSteamWalletInfo
 */
export interface TransactionSteamWalletInfo {
  /**
   *
   * @type {string}
   * @memberof TransactionSteamWalletInfo
   */
  state: string
  /**
   *
   * @type {string}
   * @memberof TransactionSteamWalletInfo
   */
  country: string
  /**
   *
   * @type {string}
   * @memberof TransactionSteamWalletInfo
   */
  currency: string
  /**
   *
   * @type {string}
   * @memberof TransactionSteamWalletInfo
   */
  status: string
}
/**
 *
 * @export
 * @interface TwoFactorAuthCode
 */
export interface TwoFactorAuthCode {
  /**
   *
   * @type {string}
   * @memberof TwoFactorAuthCode
   */
  code: string
}
/**
 *
 * @export
 * @interface TwoFactorEmailCode
 */
export interface TwoFactorEmailCode {
  /**
   *
   * @type {string}
   * @memberof TwoFactorEmailCode
   */
  code: string
}
/**
 *
 * @export
 * @interface TwoFactorRecoveryCodes
 */
export interface TwoFactorRecoveryCodes {
  /**
   *
   * @type {Array<string>}
   * @memberof TwoFactorRecoveryCodes
   */
  requiresTwoFactorAuth?: Array<string>
  /**
   *
   * @type {Array<TwoFactorRecoveryCodesOtpInner>}
   * @memberof TwoFactorRecoveryCodes
   */
  otp?: Array<TwoFactorRecoveryCodesOtpInner>
}
/**
 *
 * @export
 * @interface TwoFactorRecoveryCodesOtpInner
 */
export interface TwoFactorRecoveryCodesOtpInner {
  /**
   *
   * @type {string}
   * @memberof TwoFactorRecoveryCodesOtpInner
   */
  code: string
  /**
   *
   * @type {boolean}
   * @memberof TwoFactorRecoveryCodesOtpInner
   */
  used: boolean
}
/**
 *
 * @export
 * @interface UnityPackage
 */
export interface UnityPackage {
  /**
   *
   * @type {string}
   * @memberof UnityPackage
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof UnityPackage
   */
  assetUrl?: string | null
  /**
   *
   * @type {object}
   * @memberof UnityPackage
   */
  assetUrlObject?: object
  /**
   *
   * @type {number}
   * @memberof UnityPackage
   */
  assetVersion: number
  /**
   *
   * @type {string}
   * @memberof UnityPackage
   */
  created_at?: string
  /**
   *
   * @type {string}
   * @memberof UnityPackage
   */
  impostorizerVersion?: string
  /**
   *
   * @type {PerformanceRatings}
   * @memberof UnityPackage
   */
  performanceRating?: PerformanceRatings
  /**
   * This can be `standalonewindows` or `android`, but can also pretty much be any random Unity verison such as `2019.2.4-801-Release` or `2019.2.2-772-Release` or even `unknownplatform`.
   * @type {string}
   * @memberof UnityPackage
   */
  platform: string
  /**
   *
   * @type {string}
   * @memberof UnityPackage
   */
  pluginUrl?: string
  /**
   *
   * @type {object}
   * @memberof UnityPackage
   */
  pluginUrlObject?: object
  /**
   *
   * @type {number}
   * @memberof UnityPackage
   */
  unitySortNumber?: number
  /**
   *
   * @type {string}
   * @memberof UnityPackage
   */
  unityVersion: string
  /**
   *
   * @type {string}
   * @memberof UnityPackage
   */
  worldSignature?: string | null
  /**
   *
   * @type {string}
   * @memberof UnityPackage
   */
  impostorUrl?: string | null
  /**
   *
   * @type {string}
   * @memberof UnityPackage
   */
  scanStatus?: string
  /**
   *
   * @type {string}
   * @memberof UnityPackage
   */
  variant?: string
}
/**
 *
 * @export
 * @interface UpdateAvatarRequest
 */
export interface UpdateAvatarRequest {
  /**
   *
   * @type {string}
   * @memberof UpdateAvatarRequest
   */
  assetUrl?: string
  /**
   *
   * @type {string}
   * @memberof UpdateAvatarRequest
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof UpdateAvatarRequest
   */
  name?: string
  /**
   *
   * @type {string}
   * @memberof UpdateAvatarRequest
   */
  description?: string
  /**
   *
   * @type {Array<string>}
   * @memberof UpdateAvatarRequest
   */
  tags?: Array<string>
  /**
   *
   * @type {string}
   * @memberof UpdateAvatarRequest
   */
  imageUrl?: string
  /**
   *
   * @type {ReleaseStatus}
   * @memberof UpdateAvatarRequest
   */
  releaseStatus?: ReleaseStatus
  /**
   *
   * @type {number}
   * @memberof UpdateAvatarRequest
   */
  version?: number
  /**
   *
   * @type {string}
   * @memberof UpdateAvatarRequest
   */
  unityPackageUrl?: string
  /**
   *
   * @type {string}
   * @memberof UpdateAvatarRequest
   */
  unityVersion?: string
}
/**
 *
 * @export
 * @interface UpdateCalendarEventRequest
 */
export interface UpdateCalendarEventRequest {
  /**
   * Event title
   * @type {string}
   * @memberof UpdateCalendarEventRequest
   */
  title?: string
  /**
   * Time the vent starts at
   * @type {string}
   * @memberof UpdateCalendarEventRequest
   */
  startsAt?: string
  /**
   *
   * @type {string}
   * @memberof UpdateCalendarEventRequest
   */
  description?: string
  /**
   * Time the vent starts at
   * @type {string}
   * @memberof UpdateCalendarEventRequest
   */
  endsAt?: string
  /**
   *
   * @type {string}
   * @memberof UpdateCalendarEventRequest
   */
  category?: string
  /**
   *
   * @type {Array<string>}
   * @memberof UpdateCalendarEventRequest
   */
  tags?: Array<string>
  /**
   *
   * @type {boolean}
   * @memberof UpdateCalendarEventRequest
   */
  isDraft?: boolean
  /**
   *
   * @type {string}
   * @memberof UpdateCalendarEventRequest
   */
  imageId?: string
  /**
   *
   * @type {Array<string>}
   * @memberof UpdateCalendarEventRequest
   */
  roleIds?: Array<string>
  /**
   *
   * @type {string}
   * @memberof UpdateCalendarEventRequest
   */
  parentId?: string
  /**
   *
   * @type {Array<string>}
   * @memberof UpdateCalendarEventRequest
   */
  platforms?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof UpdateCalendarEventRequest
   */
  languages?: Array<string>
  /**
   * Send notification to group members.
   * @type {boolean}
   * @memberof UpdateCalendarEventRequest
   */
  sendCreationNotification?: boolean
  /**
   *
   * @type {boolean}
   * @memberof UpdateCalendarEventRequest
   */
  featured?: boolean
  /**
   *
   * @type {number}
   * @memberof UpdateCalendarEventRequest
   */
  hostEarlyJoinMinutes?: number
  /**
   *
   * @type {number}
   * @memberof UpdateCalendarEventRequest
   */
  guestEarlyJoinMinutes?: number
  /**
   *
   * @type {number}
   * @memberof UpdateCalendarEventRequest
   */
  closeInstanceAfterEndMinutes?: number
  /**
   *
   * @type {boolean}
   * @memberof UpdateCalendarEventRequest
   */
  usesInstanceOverflow?: boolean
}
/**
 *
 * @export
 * @interface UpdateFavoriteGroupRequest
 */
export interface UpdateFavoriteGroupRequest {
  /**
   *
   * @type {string}
   * @memberof UpdateFavoriteGroupRequest
   */
  displayName?: string
  /**
   *
   * @type {FavoriteGroupVisibility}
   * @memberof UpdateFavoriteGroupRequest
   */
  visibility?: FavoriteGroupVisibility
  /**
   * Tags on FavoriteGroups are believed to do nothing.
   * @type {Array<string>}
   * @memberof UpdateFavoriteGroupRequest
   */
  tags?: Array<string>
}
/**
 *
 * @export
 * @interface UpdateGroupGalleryRequest
 */
export interface UpdateGroupGalleryRequest {
  /**
   * Name of the gallery.
   * @type {string}
   * @memberof UpdateGroupGalleryRequest
   */
  name?: string
  /**
   * Description of the gallery.
   * @type {string}
   * @memberof UpdateGroupGalleryRequest
   */
  description?: string
  /**
   * Whether the gallery is members only.
   * @type {boolean}
   * @memberof UpdateGroupGalleryRequest
   */
  membersOnly?: boolean
  /**
   *
   * @type {Array<string>}
   * @memberof UpdateGroupGalleryRequest
   */
  roleIdsToView?: Array<string> | null
  /**
   *
   * @type {Array<string>}
   * @memberof UpdateGroupGalleryRequest
   */
  roleIdsToSubmit?: Array<string> | null
  /**
   *
   * @type {Array<string>}
   * @memberof UpdateGroupGalleryRequest
   */
  roleIdsToAutoApprove?: Array<string> | null
  /**
   *
   * @type {Array<string>}
   * @memberof UpdateGroupGalleryRequest
   */
  roleIdsToManage?: Array<string> | null
}
/**
 *
 * @export
 * @interface UpdateGroupMemberRequest
 */
export interface UpdateGroupMemberRequest {
  /**
   *
   * @type {GroupUserVisibility}
   * @memberof UpdateGroupMemberRequest
   */
  visibility?: GroupUserVisibility
  /**
   *
   * @type {boolean}
   * @memberof UpdateGroupMemberRequest
   */
  isSubscribedToAnnouncements?: boolean
  /**
   *
   * @type {string}
   * @memberof UpdateGroupMemberRequest
   */
  managerNotes?: string
}
/**
 *
 * @export
 * @interface UpdateGroupRepresentationRequest
 */
export interface UpdateGroupRepresentationRequest {
  /**
   * Whether the user is representing the group.
   * @type {boolean}
   * @memberof UpdateGroupRepresentationRequest
   */
  isRepresenting: boolean
}
/**
 *
 * @export
 * @interface UpdateGroupRequest
 */
export interface UpdateGroupRequest {
  /**
   *
   * @type {string}
   * @memberof UpdateGroupRequest
   */
  name?: string
  /**
   *
   * @type {string}
   * @memberof UpdateGroupRequest
   */
  shortCode?: string
  /**
   *
   * @type {string}
   * @memberof UpdateGroupRequest
   */
  description?: string
  /**
   *
   * @type {GroupJoinState}
   * @memberof UpdateGroupRequest
   */
  joinState?: GroupJoinState
  /**
   *
   * @type {string}
   * @memberof UpdateGroupRequest
   */
  iconId?: string | null
  /**
   *
   * @type {string}
   * @memberof UpdateGroupRequest
   */
  bannerId?: string | null
  /**
   * 3 letter language code
   * @type {Array<string>}
   * @memberof UpdateGroupRequest
   */
  languages?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof UpdateGroupRequest
   */
  links?: Array<string>
  /**
   *
   * @type {string}
   * @memberof UpdateGroupRequest
   */
  rules?: string
  /**
   *
   * @type {Array<string>}
   * @memberof UpdateGroupRequest
   */
  tags?: Array<string>
}
/**
 *
 * @export
 * @interface UpdateGroupRoleRequest
 */
export interface UpdateGroupRoleRequest {
  /**
   *
   * @type {string}
   * @memberof UpdateGroupRoleRequest
   */
  name?: string
  /**
   *
   * @type {string}
   * @memberof UpdateGroupRoleRequest
   */
  description?: string
  /**
   *
   * @type {boolean}
   * @memberof UpdateGroupRoleRequest
   */
  isSelfAssignable?: boolean
  /**
   *
   * @type {Array<GroupPermissions>}
   * @memberof UpdateGroupRoleRequest
   */
  permissions?: Array<GroupPermissions>
  /**
   *
   * @type {number}
   * @memberof UpdateGroupRoleRequest
   */
  order?: number
}
/**
 *
 * @export
 * @interface UpdateInviteMessageRequest
 */
export interface UpdateInviteMessageRequest {
  /**
   *
   * @type {string}
   * @memberof UpdateInviteMessageRequest
   */
  message: string
}
/**
 *
 * @export
 * @interface UpdateUserBadgeRequest
 */
export interface UpdateUserBadgeRequest {
  /**
   *
   * @type {boolean}
   * @memberof UpdateUserBadgeRequest
   */
  hidden?: boolean
  /**
   *
   * @type {boolean}
   * @memberof UpdateUserBadgeRequest
   */
  showcased?: boolean
}
/**
 *
 * @export
 * @interface UpdateUserNoteRequest
 */
export interface UpdateUserNoteRequest {
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof UpdateUserNoteRequest
   */
  targetUserId: string
  /**
   *
   * @type {string}
   * @memberof UpdateUserNoteRequest
   */
  note: string
}
/**
 *
 * @export
 * @interface UpdateUserRequest
 */
export interface UpdateUserRequest {
  /**
   *
   * @type {string}
   * @memberof UpdateUserRequest
   */
  email?: string
  /**
   *
   * @type {boolean}
   * @memberof UpdateUserRequest
   */
  unsubscribe?: boolean
  /**
   *
   * @type {string}
   * @memberof UpdateUserRequest
   */
  birthday?: string
  /**
   *
   * @type {number}
   * @memberof UpdateUserRequest
   */
  acceptedTOSVersion?: number
  /**
   *
   * @type {Array<string>}
   * @memberof UpdateUserRequest
   */
  tags?: Array<string>
  /**
   *
   * @type {UserStatus}
   * @memberof UpdateUserRequest
   */
  status?: UserStatus
  /**
   *
   * @type {string}
   * @memberof UpdateUserRequest
   */
  statusDescription?: string
  /**
   *
   * @type {string}
   * @memberof UpdateUserRequest
   */
  bio?: string
  /**
   *
   * @type {Array<string>}
   * @memberof UpdateUserRequest
   */
  bioLinks?: Array<string>
  /**
   *
   * @type {string}
   * @memberof UpdateUserRequest
   */
  pronouns?: string
  /**
   *
   * @type {boolean}
   * @memberof UpdateUserRequest
   */
  isBoopingEnabled?: boolean
  /**
   * MUST be a valid VRChat /file/ url.
   * @type {string}
   * @memberof UpdateUserRequest
   */
  userIcon?: string
  /**
   * These tags begin with `content_` and control content gating
   * @type {Array<string>}
   * @memberof UpdateUserRequest
   */
  contentFilters?: Array<string>
  /**
   * MUST specify currentPassword as well to change display name
   * @type {string}
   * @memberof UpdateUserRequest
   */
  displayName?: string
  /**
   * MUST specify currentPassword as well to revert display name
   * @type {boolean}
   * @memberof UpdateUserRequest
   */
  revertDisplayName?: boolean
  /**
   * MUST specify currentPassword as well to change password
   * @type {string}
   * @memberof UpdateUserRequest
   */
  password?: string
  /**
   *
   * @type {string}
   * @memberof UpdateUserRequest
   */
  currentPassword?: string
}
/**
 *
 * @export
 * @interface UpdateWorldRequest
 */
export interface UpdateWorldRequest {
  /**
   *
   * @type {string}
   * @memberof UpdateWorldRequest
   */
  assetUrl?: string
  /**
   *
   * @type {string}
   * @memberof UpdateWorldRequest
   */
  assetVersion?: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof UpdateWorldRequest
   */
  authorId?: string
  /**
   *
   * @type {string}
   * @memberof UpdateWorldRequest
   */
  authorName?: string
  /**
   *
   * @type {number}
   * @memberof UpdateWorldRequest
   */
  capacity?: number
  /**
   *
   * @type {string}
   * @memberof UpdateWorldRequest
   */
  description?: string
  /**
   *
   * @type {string}
   * @memberof UpdateWorldRequest
   */
  imageUrl?: string
  /**
   *
   * @type {string}
   * @memberof UpdateWorldRequest
   */
  name?: string
  /**
   * This can be `standalonewindows` or `android`, but can also pretty much be any random Unity verison such as `2019.2.4-801-Release` or `2019.2.2-772-Release` or even `unknownplatform`.
   * @type {string}
   * @memberof UpdateWorldRequest
   */
  platform?: string
  /**
   *
   * @type {ReleaseStatus}
   * @memberof UpdateWorldRequest
   */
  releaseStatus?: ReleaseStatus
  /**
   *
   * @type {Array<string>}
   * @memberof UpdateWorldRequest
   */
  tags?: Array<string>
  /**
   *
   * @type {string}
   * @memberof UpdateWorldRequest
   */
  unityPackageUrl?: string
  /**
   *
   * @type {string}
   * @memberof UpdateWorldRequest
   */
  unityVersion?: string
}
/**
 *
 * @export
 * @interface User
 */
export interface User {
  /**
   *
   * @type {AgeVerificationStatus}
   * @memberof User
   */
  ageVerificationStatus: AgeVerificationStatus
  /**
   * `true` if, user is age verified (not 18+).
   * @type {boolean}
   * @memberof User
   */
  ageVerified: boolean
  /**
   *
   * @type {boolean}
   * @memberof User
   */
  allowAvatarCopying: boolean
  /**
   *
   * @type {Array<Badge>}
   * @memberof User
   */
  badges?: Array<Badge>
  /**
   *
   * @type {string}
   * @memberof User
   */
  bio: string
  /**
   *
   * @type {Array<string>}
   * @memberof User
   */
  bioLinks: Array<string>
  /**
   * When profilePicOverride is not empty, use it instead.
   * @type {string}
   * @memberof User
   */
  currentAvatarImageUrl: string
  /**
   * When profilePicOverride is not empty, use it instead.
   * @type {string}
   * @memberof User
   */
  currentAvatarThumbnailImageUrl: string
  /**
   *
   * @type {Array<string>}
   * @memberof User
   */
  currentAvatarTags: Array<string>
  /**
   *
   * @type {string}
   * @memberof User
   */
  date_joined: string
  /**
   *
   * @type {DeveloperType}
   * @memberof User
   */
  developerType: DeveloperType
  /**
   * A users visual display name. This is what shows up in-game, and can different from their `username`. Changing display name is restricted to a cooldown period.
   * @type {string}
   * @memberof User
   */
  displayName: string
  /**
   *
   * @type {string}
   * @memberof User
   */
  friendKey: string
  /**
   *
   * @type {string}
   * @memberof User
   */
  friendRequestStatus?: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof User
   */
  id: string
  /**
   * InstanceID can be \"offline\" on User profiles if you are not friends with that user and \"private\" if you are friends and user is in private instance.
   * @type {string}
   * @memberof User
   */
  instanceId?: string
  /**
   * Either their `friendKey`, or empty string if you are not friends. Unknown usage.
   * @type {boolean}
   * @memberof User
   */
  isFriend: boolean
  /**
   * Either a date-time or empty string.
   * @type {string}
   * @memberof User
   */
  last_activity: string
  /**
   * Either a date-time or empty string.
   * @type {string}
   * @memberof User
   */
  last_login: string
  /**
   *
   * @type {string}
   * @memberof User
   */
  last_mobile?: string | null
  /**
   * This can be `standalonewindows` or `android`, but can also pretty much be any random Unity verison such as `2019.2.4-801-Release` or `2019.2.2-772-Release` or even `unknownplatform`.
   * @type {string}
   * @memberof User
   */
  last_platform: string
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof User
   */
  location?: string
  /**
   *
   * @type {string}
   * @memberof User
   */
  note?: string
  /**
   *
   * @type {string}
   * @memberof User
   */
  platform?: string
  /**
   *
   * @type {string}
   * @memberof User
   */
  profilePicOverride: string
  /**
   *
   * @type {string}
   * @memberof User
   */
  profilePicOverrideThumbnail: string
  /**
   *
   * @type {string}
   * @memberof User
   */
  pronouns: string
  /**
   *
   * @type {UserState}
   * @memberof User
   */
  state: UserState
  /**
   *
   * @type {UserStatus}
   * @memberof User
   */
  status: UserStatus
  /**
   *
   * @type {string}
   * @memberof User
   */
  statusDescription: string
  /**
   *
   * @type {Array<string>}
   * @memberof User
   */
  tags: Array<string>
  /**
   *
   * @type {string}
   * @memberof User
   */
  travelingToInstance?: string
  /**
   *
   * @type {string}
   * @memberof User
   */
  travelingToLocation?: string
  /**
   *
   * @type {string}
   * @memberof User
   */
  travelingToWorld?: string
  /**
   *
   * @type {string}
   * @memberof User
   */
  userIcon: string
  /**
   * -| A users unique name, used during login. This is different from `displayName` which is what shows up in-game. A users `username` can never be changed.\' **DEPRECATED:** VRChat API no longer return usernames of other users. [See issue by Tupper for more information](https://github.com/pypy-vrc/VRCX/issues/429).
   * @type {string}
   * @memberof User
   * @deprecated
   */
  username?: string
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof User
   */
  worldId?: string
}
/**
 * Status object representing if a queried user by username or userId exists or not. This model is primarily used by the `/auth/exists` endpoint, which in turn is used during registration. Please see the documentation on that endpoint for more information on usage.
 * @export
 * @interface UserExists
 */
export interface UserExists {
  /**
   * Status if a user exist with that username or userId.
   * @type {boolean}
   * @memberof UserExists
   */
  userExists: boolean
  /**
   * Is the username valid?
   * @type {boolean}
   * @memberof UserExists
   */
  nameOk?: boolean
}
/**
 *
 * @export
 * @interface UserNote
 */
export interface UserNote {
  /**
   *
   * @type {string}
   * @memberof UserNote
   */
  createdAt: string
  /**
   *
   * @type {string}
   * @memberof UserNote
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof UserNote
   */
  note: string
  /**
   *
   * @type {UserNoteTargetUser}
   * @memberof UserNote
   */
  targetUser?: UserNoteTargetUser
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof UserNote
   */
  targetUserId: string
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof UserNote
   */
  userId: string
}
/**
 *
 * @export
 * @interface UserNoteTargetUser
 */
export interface UserNoteTargetUser {
  /**
   *
   * @type {Array<string>}
   * @memberof UserNoteTargetUser
   */
  currentAvatarTags?: Array<string>
  /**
   * When profilePicOverride is not empty, use it instead.
   * @type {string}
   * @memberof UserNoteTargetUser
   */
  currentAvatarThumbnailImageUrl?: string
  /**
   *
   * @type {string}
   * @memberof UserNoteTargetUser
   */
  displayName?: string
  /**
   *
   * @type {string}
   * @memberof UserNoteTargetUser
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof UserNoteTargetUser
   */
  profilePicOverride?: string | null
  /**
   *
   * @type {string}
   * @memberof UserNoteTargetUser
   */
  userIcon?: string
}
/**
 * * \"online\" User is online in VRChat * \"active\" User is online, but not in VRChat * \"offline\" User is offline  Always offline when returned through `getCurrentUser` (/auth/user).
 * @export
 * @enum {string}
 */

export const UserState = {
  Offline: 'offline',
  Active: 'active',
  Online: 'online'
} as const

export type UserState = (typeof UserState)[keyof typeof UserState]

/**
 * Defines the User\'s current status, for example \"ask me\", \"join me\" or \"offline. This status is a combined indicator of their online activity and privacy preference.
 * @export
 * @enum {string}
 */

export const UserStatus = {
  Active: 'active',
  JoinMe: 'join me',
  AskMe: 'ask me',
  Busy: 'busy',
  Offline: 'offline'
} as const

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]

/**
 *
 * @export
 * @interface UserSubscription
 */
export interface UserSubscription {
  /**
   *
   * @type {string}
   * @memberof UserSubscription
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof UserSubscription
   */
  transactionId: string
  /**
   * Which \"Store\" it came from. Right now only Stores are \"Steam\" and \"Admin\".
   * @type {string}
   * @memberof UserSubscription
   */
  store: string
  /**
   *
   * @type {string}
   * @memberof UserSubscription
   */
  steamItemId?: string
  /**
   *
   * @type {number}
   * @memberof UserSubscription
   */
  amount: number
  /**
   *
   * @type {string}
   * @memberof UserSubscription
   */
  description: string
  /**
   *
   * @type {SubscriptionPeriod}
   * @memberof UserSubscription
   */
  period: SubscriptionPeriod
  /**
   *
   * @type {number}
   * @memberof UserSubscription
   */
  tier: number
  /**
   *
   * @type {boolean}
   * @memberof UserSubscription
   */
  active: boolean
  /**
   *
   * @type {TransactionStatus}
   * @memberof UserSubscription
   */
  status: TransactionStatus
  /**
   *
   * @type {string}
   * @memberof UserSubscription
   */
  starts?: string
  /**
   *
   * @type {string}
   * @memberof UserSubscription
   */
  expires: string
  /**
   *
   * @type {string}
   * @memberof UserSubscription
   */
  created_at: string
  /**
   *
   * @type {string}
   * @memberof UserSubscription
   */
  updated_at: string
  /**
   *
   * @type {Array<string>}
   * @memberof UserSubscription
   */
  licenseGroups: Array<string>
  /**
   *
   * @type {boolean}
   * @memberof UserSubscription
   */
  isGift: boolean
  /**
   *
   * @type {boolean}
   * @memberof UserSubscription
   */
  isBulkGift: boolean
}
/**
 *
 * @export
 * @interface Verify2FAEmailCodeResult
 */
export interface Verify2FAEmailCodeResult {
  /**
   *
   * @type {boolean}
   * @memberof Verify2FAEmailCodeResult
   */
  verified: boolean
}
/**
 *
 * @export
 * @interface Verify2FAResult
 */
export interface Verify2FAResult {
  /**
   *
   * @type {boolean}
   * @memberof Verify2FAResult
   */
  verified: boolean
  /**
   *
   * @type {boolean}
   * @memberof Verify2FAResult
   */
  enabled?: boolean
}
/**
 *
 * @export
 * @interface VerifyAuthTokenResult
 */
export interface VerifyAuthTokenResult {
  /**
   *
   * @type {boolean}
   * @memberof VerifyAuthTokenResult
   */
  ok: boolean
  /**
   *
   * @type {string}
   * @memberof VerifyAuthTokenResult
   */
  token: string
}
/**
 *
 * @export
 * @interface World
 */
export interface World {
  /**
   * A users unique ID, usually in the form of `usr_c1644b5b-3ca4-45b4-97c6-a2a0de70d469`. Legacy players can have old IDs in the form of `8JoV9XEdpo`. The ID can never be changed.
   * @type {string}
   * @memberof World
   */
  authorId: string
  /**
   *
   * @type {string}
   * @memberof World
   */
  authorName: string
  /**
   *
   * @type {number}
   * @memberof World
   */
  capacity: number
  /**
   *
   * @type {number}
   * @memberof World
   */
  recommendedCapacity: number
  /**
   *
   * @type {string}
   * @memberof World
   */
  created_at: string
  /**
   *
   * @type {InstanceContentSettings}
   * @memberof World
   */
  defaultContentSettings?: InstanceContentSettings
  /**
   *
   * @type {string}
   * @memberof World
   */
  description: string
  /**
   *
   * @type {number}
   * @memberof World
   */
  favorites?: number
  /**
   *
   * @type {boolean}
   * @memberof World
   */
  featured: boolean
  /**
   *
   * @type {number}
   * @memberof World
   */
  heat: number
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof World
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof World
   */
  imageUrl: string
  /**
   * Will always be an empty list when unauthenticated.
   * @type {Array<Array<any>>}
   * @memberof World
   */
  instances?: Array<Array<any>>
  /**
   *
   * @type {string}
   * @memberof World
   */
  labsPublicationDate: string
  /**
   *
   * @type {string}
   * @memberof World
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof World
   */
  namespace?: string
  /**
   * Will always be `0` when unauthenticated.
   * @type {number}
   * @memberof World
   */
  occupants?: number
  /**
   *
   * @type {string}
   * @memberof World
   */
  organization: string
  /**
   *
   * @type {number}
   * @memberof World
   */
  popularity: number
  /**
   *
   * @type {string}
   * @memberof World
   */
  previewYoutubeId?: string | null
  /**
   * Will always be `0` when unauthenticated.
   * @type {number}
   * @memberof World
   */
  privateOccupants?: number
  /**
   * Will always be `0` when unauthenticated.
   * @type {number}
   * @memberof World
   */
  publicOccupants?: number
  /**
   *
   * @type {string}
   * @memberof World
   */
  publicationDate: string
  /**
   *
   * @type {ReleaseStatus}
   * @memberof World
   */
  releaseStatus: ReleaseStatus
  /**
   *
   * @type {string}
   * @memberof World
   */
  storeId?: string
  /**
   *
   * @type {Array<string>}
   * @memberof World
   */
  tags: Array<string>
  /**
   *
   * @type {string}
   * @memberof World
   */
  thumbnailImageUrl: string
  /**
   * Empty if unauthenticated.
   * @type {Array<UnityPackage>}
   * @memberof World
   */
  unityPackages?: Array<UnityPackage>
  /**
   *
   * @type {string}
   * @memberof World
   */
  updated_at: string
  /**
   *
   * @type {Array<string>}
   * @memberof World
   */
  urlList?: Array<string>
  /**
   *
   * @type {number}
   * @memberof World
   */
  version: number
  /**
   *
   * @type {number}
   * @memberof World
   */
  visits: number
  /**
   *
   * @type {Array<string>}
   * @memberof World
   */
  udonProducts?: Array<string>
}
/**
 *
 * @export
 * @interface WorldMetadata
 */
export interface WorldMetadata {
  /**
   * WorldID be \"offline\" on User profiles if you are not friends with that user.
   * @type {string}
   * @memberof WorldMetadata
   */
  id: string
  /**
   *
   * @type {object}
   * @memberof WorldMetadata
   */
  metadata: object
}
/**
 *
 * @export
 * @interface WorldPublishStatus
 */
export interface WorldPublishStatus {
  /**
   *
   * @type {boolean}
   * @memberof WorldPublishStatus
   */
  canPublish: boolean
}

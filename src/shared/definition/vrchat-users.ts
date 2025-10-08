import type { CurrentUserAvatar, UserAvatar } from './vrchat-avatars'
import type {
  AgeVerificationStatus,
  DeveloperType,
  Platform,
  UserState,
  UserStatus
} from './vrchat-api-response'

export const UserTrustRank = {
  Visitor: '__unset_visitor__',
  Troll: 'system_troll',
  New: 'system_trust_basic',
  User: 'system_trust_known',
  Known: 'system_trust_trusted',
  Trusted: 'system_trust_veteran',
  Moderator: 'admin_moderator'
} as const

export type UserTrustRank = (typeof UserTrustRank)[keyof typeof UserTrustRank]

export const UserLanguage = {
  ENG: 'language_eng',
  KOR: 'language_kor',
  RUS: 'language_rus',
  SPA: 'language_spa',
  POR: 'language_por',
  ZHO: 'language_zho',
  DEU: 'language_deu',
  JPN: 'language_jpn',
  FRA: 'language_fra',
  SWE: 'language_swe',
  NLD: 'language_nld',
  POL: 'language_pol',
  DAN: 'language_dan',
  NOR: 'language_nor',
  ITA: 'language_ita',
  THA: 'language_tha',
  FIN: 'language_fin',
  HUN: 'language_hun',
  CES: 'language_ces',
  TUR: 'language_tur',
  ARA: 'language_ara',
  RON: 'language_ron',
  VIE: 'language_vie',
  IND: 'language_ind',
  MSA: 'language_msa',
  FIL: 'language_fil',
  CMN: 'language_cmn',
  TWS: 'language_tws',
  HEB: 'language_heb',
  HMN: 'language_hmn',
  UKR: 'language_ukr',
  TOK: 'language_tok',
  YUE: 'language_yue',
  WUU: 'language_wuu',
  ASE: 'language_ase',
  BFI: 'language_bfi',
  DSE: 'language_dse',
  FSL: 'language_fsl',
  JSL: 'language_jsl',
  KVK: 'language_kvk'
} as const

export type UserLanguage = (typeof UserLanguage)[keyof typeof UserLanguage]

export const UserSocial = {
  Pixiv: 'pixiv',
  Bilibili: 'bilibili',
  Booth: 'booth',
  Youtube: 'youtube',
  Discord: 'discord',
  QQ: 'qq',
  Telegram: 'telegram',
  Steam: 'steam',
  X: 'x',
  Github: 'github',
  Tiktok: 'tiktok',
  Facebook: 'facebook',
  Reddit: 'reddit',
  Instagram: 'instagram',
  Twitch: 'twitch',
  Vimeo: 'vimeo',
  Weibo: 'weibo',
  Line: 'line',
  Niconico: 'niconico',
  Patreon: 'patreon',
  Kofi: 'ko-fi',
  Other: 'other'
} as const

export type UserSocial = (typeof UserSocial)[keyof typeof UserSocial]

export interface UserSummary {
  userId: string
  profileIconFileId: string
  profileIconFileVersion: number
  displayName: string
  trustRank: UserTrustRank
  languages: UserLanguage[]
  isSupporter: boolean
}

export interface UserInformationBase {
  userId: string
  profileIconFileId: string
  profileIconFileVersion: number
  profileBackgroundFileId: string
  profileBackgroundFileVersion: number
  displayName: string
  state: UserState
  status: UserStatus
  statusDescription: string
  bio: string
  bioLinks: string[]
  tags: string[]
  platform: Platform
  trustRank: UserTrustRank
  languages: UserLanguage[]
  isSupporter: boolean
}

export interface UserInformation extends UserInformationBase {
  pronouns: string
  isFriend: boolean
  badges: UserBadge[]
  developerType: DeveloperType
  avatar: UserAvatar
  allowAvatarCopying: boolean
  ageVerified: boolean
  ageVerificationStatus: AgeVerificationStatus
  locationRawContext: string | null
  registeredAt: Date | null
}

export interface CurrentUserInformation extends UserInformationBase {
  pronouns: string
  badges: UserBadge[]
  developerType: DeveloperType
  avatar: CurrentUserAvatar
  ageVerified: boolean
  ageVerificationStatus: AgeVerificationStatus
  statusHistory: string[]
  registeredAt: Date | null
}

export interface UserBadge {
  badgeId: string
  name: string
  description: string
  showcased: boolean
  thumbnailUrl: string
}

export interface UserBadge {
  badgeId: string
  name: string
  description: string
  showcased: boolean
  thumbnailUrl: string
}

export interface CurrentUserBadge extends UserBadge {
  assignedAt: Date | null
  updatedAt: Date | null
  hidden: boolean
}

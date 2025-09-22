import LanguageEngIcon from '@shared/assets/vector/language-eng.svg?component'
import LanguageKorIcon from '@shared/assets/vector/language-kor.svg?component'
import LanguageRusIcon from '@shared/assets/vector/language-rus.svg?component'
import LanguageSpaIcon from '@shared/assets/vector/language-spa.svg?component'
import LanguagePorIcon from '@shared/assets/vector/language-por.svg?component'
import LanguageZhoIcon from '@shared/assets/vector/language-zho.svg?component'
import LanguageDeuIcon from '@shared/assets/vector/language-deu.svg?component'
import LanguageJpnIcon from '@shared/assets/vector/language-jpn.svg?component'
import LanguageFraIcon from '@shared/assets/vector/language-fra.svg?component'
import LanguageSweIcon from '@shared/assets/vector/language-swe.svg?component'
import LanguageNldIcon from '@shared/assets/vector/language-nld.svg?component'
import LanguagePolIcon from '@shared/assets/vector/language-pol.svg?component'
import LanguageDanIcon from '@shared/assets/vector/language-dan.svg?component'
import LanguageNorIcon from '@shared/assets/vector/language-nor.svg?component'
import LanguageItaIcon from '@shared/assets/vector/language-ita.svg?component'
import LanguageThaIcon from '@shared/assets/vector/language-tha.svg?component'
import LanguageFinIcon from '@shared/assets/vector/language-fin.svg?component'
import LanguageHunIcon from '@shared/assets/vector/language-hun.svg?component'
import LanguageCesIcon from '@shared/assets/vector/language-ces.svg?component'
import LanguageTurIcon from '@shared/assets/vector/language-tur.svg?component'
import LanguageAraIcon from '@shared/assets/vector/language-ara.svg?component'
import LanguageRonIcon from '@shared/assets/vector/language-ron.svg?component'
import LanguageVieIcon from '@shared/assets/vector/language-vie.svg?component'
import LanguageIndIcon from '@shared/assets/vector/language-ind.svg?component'
import LanguageMsaIcon from '@shared/assets/vector/language-msa.svg?component'
import LanguageTwsIcon from '@shared/assets/vector/language-tws.svg?component'
import LanguageFilIcon from '@shared/assets/vector/language-fil.svg?component'
import LanguageCmnIcon from '@shared/assets/vector/language-cmn.svg?component'
import LanguageHebIcon from '@shared/assets/vector/language-heb.svg?component'
import LanguageHmnIcon from '@shared/assets/vector/language-hmn.svg?component'
import LanguageUkrIcon from '@shared/assets/vector/language-ukr.svg?component'
import LanguageTokIcon from '@shared/assets/vector/language-tok.svg?component'
import LanguageYueIcon from '@shared/assets/vector/language-yue.svg?component'
import LanguageWuuIcon from '@shared/assets/vector/language-wuu.svg?component'
import LanguageAseIcon from '@shared/assets/vector/language-ase.svg?component'
import LanguageBfiIcon from '@shared/assets/vector/language-bfi.svg?component'
import LanguageDseIcon from '@shared/assets/vector/language-dse.svg?component'
import LanguageFslIcon from '@shared/assets/vector/language-fsl.svg?component'
import LanguageJslIcon from '@shared/assets/vector/language-jsl.svg?component'
import LanguageKvkIcon from '@shared/assets/vector/language-kvk.svg?component'
import SocialPixivIcon from '@shared/assets/vector/social-pixiv.svg?component'
import SocialBilibiliIcon from '@shared/assets/vector/social-bilibili.svg?component'
import SocialBoothIcon from '@shared/assets/vector/social-booth.svg?component'
import SocialYoutubeIcon from '@shared/assets/vector/social-youtube.svg?component'
import SocialDiscordIcon from '@shared/assets/vector/social-discord.svg?component'
import SocialQQIcon from '@shared/assets/vector/social-qq.svg?component'
import SocialTelegramIcon from '@shared/assets/vector/social-telegram.svg?component'
import SocialSteamIcon from '@shared/assets/vector/social-steam.svg?component'
import SocialXIcon from '@shared/assets/vector/social-x.svg?component'
import SocialGithubIcon from '@shared/assets/vector/social-github.svg?component'
import SocialTiktokIcon from '@shared/assets/vector/social-tiktok.svg?component'
import SocialFacebookIcon from '@shared/assets/vector/social-facebook.svg?component'
import SocialRedditIcon from '@shared/assets/vector/social-reddit.svg?component'
import SocialInstagramIcon from '@shared/assets/vector/social-instagram.svg?component'
import SocialTwitchIcon from '@shared/assets/vector/social-twitch.svg?component'
import SocialVimeoIcon from '@shared/assets/vector/social-vimeo.svg?component'
import SocialWeiboIcon from '@shared/assets/vector/social-weibo.svg?component'
import SocialLineIcon from '@shared/assets/vector/social-line.svg?component'
import SocialNiconicoIcon from '@shared/assets/vector/social-niconico.svg?component'
import SocialPatreonIcon from '@shared/assets/vector/social-patreon.svg?component'
import SocialKofiIcon from '@shared/assets/vector/social-kofi.svg?component'
import SocialOtherIcon from '@shared/assets/vector/social-other.svg?component'
import { UserLanguage, UserSocial, UserTrustRank } from '@shared/definition/vrchat-users'
import { UserStatus } from '@shared/definition/vrchat-api-response'
import type { LocaleI18NKeys } from '../locale/types'
import type { LanguageDefinitionItem, SocialPatternItem } from './types'

export const STATUS_PRIORITY: Record<UserStatus, number> = {
  [UserStatus.JoinMe]: 0,
  [UserStatus.Active]: 1,
  [UserStatus.AskMe]: 2,
  [UserStatus.Busy]: 3,
  [UserStatus.Offline]: 4
} as const

export const STATUS_TRANSLATE_KEY: Record<UserStatus, LocaleI18NKeys> = {
  [UserStatus.Offline]: 'profile.status.offline',
  [UserStatus.Active]: 'profile.status.active',
  [UserStatus.AskMe]: 'profile.status.ask_me',
  [UserStatus.Busy]: 'profile.status.busy',
  [UserStatus.JoinMe]: 'profile.status.join_me'
}

export const TRUST_RANK_TRANSLATE_KEY: Record<UserTrustRank, LocaleI18NKeys> = {
  [UserTrustRank.Visitor]: 'profile.trust_rank.visitor',
  [UserTrustRank.Troll]: 'profile.trust_rank.troll',
  [UserTrustRank.New]: 'profile.trust_rank.new',
  [UserTrustRank.User]: 'profile.trust_rank.user',
  [UserTrustRank.Known]: 'profile.trust_rank.known',
  [UserTrustRank.Trusted]: 'profile.trust_rank.trusted',
  [UserTrustRank.Moderator]: 'profile.trust_rank.moderator'
}

export const SOCIAL_PATTERN_MAPPING: Record<UserSocial, SocialPatternItem> = {
  [UserSocial.Pixiv]: {
    label: 'profile.social.pixiv',
    icon: SocialPixivIcon,
    pattern: (href) => /^https?:\/\/(www\.)?pixiv\.net\/.*$/.test(href)
  },
  [UserSocial.Bilibili]: {
    label: 'profile.social.bilibili',
    icon: SocialBilibiliIcon,
    pattern: (href) =>
      /^https?:\/\/(?:www\.|live\.|space\.)?bilibili\.com\/.*$|^https?:\/\/b23\.tv\/.*$/i.test(href)
  },
  [UserSocial.Booth]: {
    label: 'profile.social.booth',
    icon: SocialBoothIcon,
    pattern: (href) => /^https?:\/\/(?:[a-z0-9-]+\.)?booth\.pm\/.*$/.test(href)
  },
  [UserSocial.Youtube]: {
    label: 'profile.social.youtube',
    icon: SocialYoutubeIcon,
    pattern: (href) =>
      /^https?:\/\/(?:www\.|m\.)?youtube\.com\/.*$|^https?:\/\/youtu\.be\/.*$/i.test(href)
  },
  [UserSocial.Discord]: {
    label: 'profile.social.discord',
    icon: SocialDiscordIcon,
    pattern: (href) =>
      /^https?:\/\/(www\.)?discord\.gg\/.*$|^https?:\/\/(www\.)?discord\.com\/.*$|^https?:\/\/discordapp\.com\/.*$/i.test(
        href
      )
  },
  [UserSocial.QQ]: {
    label: 'profile.social.qq',
    icon: SocialQQIcon,
    pattern: (href) => /^https?:\/\/(?:qm\.|qun\.|jq\.)?qq\.com\/.*$/.test(href)
  },
  [UserSocial.Telegram]: {
    label: 'profile.social.telegram',
    icon: SocialTelegramIcon,
    pattern: (href) => /^https?:\/\/t\.me\/.*$/.test(href)
  },
  [UserSocial.Steam]: {
    label: 'profile.social.steam',
    icon: SocialSteamIcon,
    pattern: (href) =>
      /^https?:\/\/(www\.)?steamcommunity\.com\/.*$|^https?:\/\/s\.team\/.*$/i.test(href)
  },
  [UserSocial.X]: {
    label: 'profile.social.x',
    icon: SocialXIcon,
    pattern: (href) => /^https?:\/\/(www\.)?x\.com\/.*$|^https?:\/\/twitter\.com\/.*$/i.test(href)
  },
  [UserSocial.Github]: {
    label: 'profile.social.github',
    icon: SocialGithubIcon,
    pattern: (href) => /^https?:\/\/(www\.)?github\.com\/.*$/.test(href)
  },
  [UserSocial.Tiktok]: {
    label: 'profile.social.tiktok',
    icon: SocialTiktokIcon,
    pattern: (href) =>
      /^https?:\/\/(www\.)?tiktok\.com\/.*$|^https?:\/\/(www\.)?douyin\.com\/.*$/i.test(href)
  },
  [UserSocial.Facebook]: {
    label: 'profile.social.facebook',
    icon: SocialFacebookIcon,
    pattern: (href) => /^https?:\/\/(www\.)?facebook\.com\/.*$/.test(href)
  },
  [UserSocial.Reddit]: {
    label: 'profile.social.reddit',
    icon: SocialRedditIcon,
    pattern: (href) => /^https?:\/\/(www\.)?reddit\.com\/.*$/.test(href)
  },
  [UserSocial.Instagram]: {
    label: 'profile.social.instagram',
    icon: SocialInstagramIcon,
    pattern: (href) => /^https?:\/\/(www\.)?instagram\.com\/.*$/.test(href)
  },
  [UserSocial.Twitch]: {
    label: 'profile.social.twitch',
    icon: SocialTwitchIcon,
    pattern: (href) => /^https?:\/\/(www\.)?twitch\.tv\/.*$/.test(href)
  },
  [UserSocial.Vimeo]: {
    label: 'profile.social.vimeo',
    icon: SocialVimeoIcon,
    pattern: (href) => /^https?:\/\/(www\.)?vimeo\.com\/.*$/.test(href)
  },
  [UserSocial.Weibo]: {
    label: 'profile.social.weibo',
    icon: SocialWeiboIcon,
    pattern: (href) =>
      /^https?:\/\/(www\.)?weibo\.com\/.*$|^https?:\/\/(www\.)?weibo\.cn\/.*$/i.test(href)
  },
  [UserSocial.Line]: {
    label: 'profile.social.line',
    icon: SocialLineIcon,
    pattern: (href) => /^https?:\/\/line\.me\/.*$/.test(href)
  },
  [UserSocial.Niconico]: {
    label: 'profile.social.niconico',
    icon: SocialNiconicoIcon,
    pattern: (href) => /^https?:\/\/(www\.)?nicovideo\.jp\/.*$/.test(href)
  },
  [UserSocial.Patreon]: {
    label: 'profile.social.patreon',
    icon: SocialPatreonIcon,
    pattern: (href) => /^https?:\/\/(www\.)?patreon\.com\/.*$/.test(href)
  },
  [UserSocial.Kofi]: {
    label: 'profile.social.ko-fi',
    icon: SocialKofiIcon,
    pattern: (href) => /^https?:\/\/(www\.)?ko-fi\.com\/.*$/.test(href)
  },
  [UserSocial.Other]: {
    label: 'profile.social.other',
    icon: SocialOtherIcon,
    pattern: () => true
  }
}

export const LANGUAGE_DEFINITION_KEY: Record<UserLanguage, LanguageDefinitionItem> = {
  [UserLanguage.ENG]: { icon: LanguageEngIcon, label: 'profile.locale.language_eng' },
  [UserLanguage.KOR]: { icon: LanguageKorIcon, label: 'profile.locale.language_kor' },
  [UserLanguage.RUS]: { icon: LanguageRusIcon, label: 'profile.locale.language_rus' },
  [UserLanguage.SPA]: { icon: LanguageSpaIcon, label: 'profile.locale.language_spa' },
  [UserLanguage.POR]: { icon: LanguagePorIcon, label: 'profile.locale.language_por' },
  [UserLanguage.ZHO]: { icon: LanguageZhoIcon, label: 'profile.locale.language_zho' },
  [UserLanguage.DEU]: { icon: LanguageDeuIcon, label: 'profile.locale.language_deu' },
  [UserLanguage.JPN]: { icon: LanguageJpnIcon, label: 'profile.locale.language_jpn' },
  [UserLanguage.FRA]: { icon: LanguageFraIcon, label: 'profile.locale.language_fra' },
  [UserLanguage.SWE]: { icon: LanguageSweIcon, label: 'profile.locale.language_swe' },
  [UserLanguage.NLD]: { icon: LanguageNldIcon, label: 'profile.locale.language_nld' },
  [UserLanguage.POL]: { icon: LanguagePolIcon, label: 'profile.locale.language_pol' },
  [UserLanguage.DAN]: { icon: LanguageDanIcon, label: 'profile.locale.language_dan' },
  [UserLanguage.NOR]: { icon: LanguageNorIcon, label: 'profile.locale.language_nor' },
  [UserLanguage.ITA]: { icon: LanguageItaIcon, label: 'profile.locale.language_ita' },
  [UserLanguage.THA]: { icon: LanguageThaIcon, label: 'profile.locale.language_tha' },
  [UserLanguage.FIN]: { icon: LanguageFinIcon, label: 'profile.locale.language_fin' },
  [UserLanguage.HUN]: { icon: LanguageHunIcon, label: 'profile.locale.language_hun' },
  [UserLanguage.CES]: { icon: LanguageCesIcon, label: 'profile.locale.language_ces' },
  [UserLanguage.TUR]: { icon: LanguageTurIcon, label: 'profile.locale.language_tur' },
  [UserLanguage.ARA]: { icon: LanguageAraIcon, label: 'profile.locale.language_ara' },
  [UserLanguage.RON]: { icon: LanguageRonIcon, label: 'profile.locale.language_ron' },
  [UserLanguage.VIE]: { icon: LanguageVieIcon, label: 'profile.locale.language_vie' },
  [UserLanguage.IND]: { icon: LanguageIndIcon, label: 'profile.locale.language_ind' },
  [UserLanguage.MSA]: { icon: LanguageMsaIcon, label: 'profile.locale.language_msa' },
  [UserLanguage.FIL]: { icon: LanguageFilIcon, label: 'profile.locale.language_fil' },
  [UserLanguage.TWS]: { icon: LanguageTwsIcon, label: 'profile.locale.language_tws' },
  [UserLanguage.CMN]: { icon: LanguageCmnIcon, label: 'profile.locale.language_cmn' },
  [UserLanguage.HEB]: { icon: LanguageHebIcon, label: 'profile.locale.language_heb' },
  [UserLanguage.HMN]: { icon: LanguageHmnIcon, label: 'profile.locale.language_hmn' },
  [UserLanguage.UKR]: { icon: LanguageUkrIcon, label: 'profile.locale.language_ukr' },
  [UserLanguage.TOK]: { icon: LanguageTokIcon, label: 'profile.locale.language_tok' },
  [UserLanguage.YUE]: { icon: LanguageYueIcon, label: 'profile.locale.language_yue' },
  [UserLanguage.WUU]: { icon: LanguageWuuIcon, label: 'profile.locale.language_wuu' },
  [UserLanguage.ASE]: { icon: LanguageAseIcon, label: 'profile.locale.language_ase' },
  [UserLanguage.BFI]: { icon: LanguageBfiIcon, label: 'profile.locale.language_bfi' },
  [UserLanguage.DSE]: { icon: LanguageDseIcon, label: 'profile.locale.language_dse' },
  [UserLanguage.FSL]: { icon: LanguageFslIcon, label: 'profile.locale.language_fsl' },
  [UserLanguage.JSL]: { icon: LanguageJslIcon, label: 'profile.locale.language_jsl' },
  [UserLanguage.KVK]: { icon: LanguageKvkIcon, label: 'profile.locale.language_kvk' }
}

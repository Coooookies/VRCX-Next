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
import SocialOtherIcon from '@shared/assets/vector/social-other.svg?component'
import { UserSocial } from '@shared/definition/vrchat-users'
import type { LocaleI18NKeys } from '../locale/types'
import type { FunctionalComponent } from 'vue'

export type SocialPatternItem = {
  label: LocaleI18NKeys
  icon: FunctionalComponent
  pattern: (href: string) => boolean
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
      /^https?:\/\/(?:www\.|live\.|space\.)?bilibili\.com(?:\/|$)|^https?:\/\/b23\.tv(?:\/|$)/i.test(
        href
      )
  },
  [UserSocial.Booth]: {
    label: 'profile.social.booth',
    icon: SocialBoothIcon,
    pattern: (href) => /^https?:\/\/(www\.)?booth\.pm\/.*$/.test(href)
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
    pattern: (href) => /^https?:\/\/discord\.gg\/.*$/.test(href)
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
  [UserSocial.Other]: {
    label: 'profile.social.other',
    icon: SocialOtherIcon,
    pattern: () => true
  }
}

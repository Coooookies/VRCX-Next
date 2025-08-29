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
import { UserLanguage } from '@shared/definition/vrchat-users'
import {
  LocationInstance,
  LocationInstanceGroupType,
  LocationInstancePublicType,
  LocationInstanceUserType
} from '@shared/definition/vrchat-instances'
import { UserStatus } from '@shared/definition/vrchat-api-response'
import { UserTrustRank } from '@shared/definition/vrchat-users'
import type { FunctionalComponent } from 'vue'
import type { LocaleI18NKeys } from '../locale/types'

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

export const LOCATION_TYPE_TRANSLATE_KEY: Record<LocationInstance['type'], LocaleI18NKeys> = {
  [LocationInstanceUserType.Friends]: 'profile.instance_type.friends',
  [LocationInstanceUserType.FriendsPlus]: 'profile.instance_type.friends_plus',
  [LocationInstanceUserType.Invite]: 'profile.instance_type.invite',
  [LocationInstanceUserType.InvitePlus]: 'profile.instance_type.invite_plus',
  [LocationInstanceGroupType.Group]: 'profile.instance_type.group',
  [LocationInstanceGroupType.GroupPlus]: 'profile.instance_type.group_plus',
  [LocationInstanceGroupType.GroupPublic]: 'profile.instance_type.group_public',
  [LocationInstancePublicType.Public]: 'profile.instance_type.public'
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

export const LANGUAGE_DEFINITION_KEY: Record<
  UserLanguage,
  { icon: FunctionalComponent; label: LocaleI18NKeys }
> = {
  [UserLanguage.ENG]: { icon: LanguageEngIcon, label: 'profile.locate.language_eng' },
  [UserLanguage.KOR]: { icon: LanguageKorIcon, label: 'profile.locate.language_kor' },
  [UserLanguage.RUS]: { icon: LanguageRusIcon, label: 'profile.locate.language_rus' },
  [UserLanguage.SPA]: { icon: LanguageSpaIcon, label: 'profile.locate.language_spa' },
  [UserLanguage.POR]: { icon: LanguagePorIcon, label: 'profile.locate.language_por' },
  [UserLanguage.ZHO]: { icon: LanguageZhoIcon, label: 'profile.locate.language_zho' },
  [UserLanguage.DEU]: { icon: LanguageDeuIcon, label: 'profile.locate.language_deu' },
  [UserLanguage.JPN]: { icon: LanguageJpnIcon, label: 'profile.locate.language_jpn' },
  [UserLanguage.FRA]: { icon: LanguageFraIcon, label: 'profile.locate.language_fra' },
  [UserLanguage.SWE]: { icon: LanguageSweIcon, label: 'profile.locate.language_swe' },
  [UserLanguage.NLD]: { icon: LanguageNldIcon, label: 'profile.locate.language_nld' },
  [UserLanguage.POL]: { icon: LanguagePolIcon, label: 'profile.locate.language_pol' },
  [UserLanguage.DAN]: { icon: LanguageDanIcon, label: 'profile.locate.language_dan' },
  [UserLanguage.NOR]: { icon: LanguageNorIcon, label: 'profile.locate.language_nor' },
  [UserLanguage.ITA]: { icon: LanguageItaIcon, label: 'profile.locate.language_ita' },
  [UserLanguage.THA]: { icon: LanguageThaIcon, label: 'profile.locate.language_tha' },
  [UserLanguage.FIN]: { icon: LanguageFinIcon, label: 'profile.locate.language_fin' },
  [UserLanguage.HUN]: { icon: LanguageHunIcon, label: 'profile.locate.language_hun' },
  [UserLanguage.CES]: { icon: LanguageCesIcon, label: 'profile.locate.language_ces' },
  [UserLanguage.TUR]: { icon: LanguageTurIcon, label: 'profile.locate.language_tur' },
  [UserLanguage.ARA]: { icon: LanguageAraIcon, label: 'profile.locate.language_ara' },
  [UserLanguage.RON]: { icon: LanguageRonIcon, label: 'profile.locate.language_ron' },
  [UserLanguage.VIE]: { icon: LanguageVieIcon, label: 'profile.locate.language_vie' },
  [UserLanguage.IND]: { icon: LanguageIndIcon, label: 'profile.locate.language_ind' },
  [UserLanguage.MSA]: { icon: LanguageMsaIcon, label: 'profile.locate.language_msa' },
  [UserLanguage.FIL]: { icon: LanguageFilIcon, label: 'profile.locate.language_fil' },
  [UserLanguage.TWS]: { icon: LanguageTwsIcon, label: 'profile.locate.language_tws' },
  [UserLanguage.CMN]: { icon: LanguageCmnIcon, label: 'profile.locate.language_cmn' },
  [UserLanguage.HEB]: { icon: LanguageHebIcon, label: 'profile.locate.language_heb' },
  [UserLanguage.HMN]: { icon: LanguageHmnIcon, label: 'profile.locate.language_hmn' },
  [UserLanguage.UKR]: { icon: LanguageUkrIcon, label: 'profile.locate.language_ukr' },
  [UserLanguage.TOK]: { icon: LanguageTokIcon, label: 'profile.locate.language_tok' },
  [UserLanguage.YUE]: { icon: LanguageYueIcon, label: 'profile.locate.language_yue' },
  [UserLanguage.WUU]: { icon: LanguageWuuIcon, label: 'profile.locate.language_wuu' },
  [UserLanguage.ASE]: { icon: LanguageAseIcon, label: 'profile.locate.language_ase' },
  [UserLanguage.BFI]: { icon: LanguageBfiIcon, label: 'profile.locate.language_bfi' },
  [UserLanguage.DSE]: { icon: LanguageDseIcon, label: 'profile.locate.language_dse' },
  [UserLanguage.FSL]: { icon: LanguageFslIcon, label: 'profile.locate.language_fsl' },
  [UserLanguage.JSL]: { icon: LanguageJslIcon, label: 'profile.locate.language_jsl' },
  [UserLanguage.KVK]: { icon: LanguageKvkIcon, label: 'profile.locate.language_kvk' }
}

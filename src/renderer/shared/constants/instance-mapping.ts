import {
  LocationInstance,
  LocationInstanceGroupType,
  LocationInstancePublicType,
  LocationInstanceUserType
} from '@shared/definition/vrchat-instances'
import { ReleaseStatus } from '@shared/definition/vrchat-api-response'
import type { LocaleI18NKeys } from '../locale/types'

export const LOCATION_TYPE_TRANSLATE_KEY: Record<LocationInstance['type'], LocaleI18NKeys> = {
  [LocationInstanceUserType.Friends]: 'instance.type.friends',
  [LocationInstanceUserType.FriendsPlus]: 'instance.type.friends_plus',
  [LocationInstanceUserType.Invite]: 'instance.type.invite',
  [LocationInstanceUserType.InvitePlus]: 'instance.type.invite_plus',
  [LocationInstanceGroupType.Group]: 'instance.type.group',
  [LocationInstanceGroupType.GroupPlus]: 'instance.type.group_plus',
  [LocationInstanceGroupType.GroupPublic]: 'instance.type.group_public',
  [LocationInstancePublicType.Public]: 'instance.type.public'
}

export const RELEASE_STATUS_TRANSLATE_KEY: Record<ReleaseStatus, LocaleI18NKeys> = {
  [ReleaseStatus.Public]: 'works.release_status.public',
  [ReleaseStatus.Private]: 'works.release_status.private',
  [ReleaseStatus.Hidden]: 'works.release_status.hidden',
  [ReleaseStatus.All]: 'works.release_status.all'
}

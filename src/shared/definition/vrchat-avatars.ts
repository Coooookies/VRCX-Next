export interface ReferenceAvatar {
  imageFileId: string
  imageFileVersion: number
}

export interface UserAvatar {
  avatarId: string
  allowCopying: boolean
  imageFileId: string
  imageFileVersion: number
}

export interface ReferenceAvatarWithDetail extends ReferenceAvatar {
  avatarName: string
  ownerUserId: string
}

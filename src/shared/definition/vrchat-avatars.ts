export interface UserAvatar {
  avatarName?: string
  imageFileId: string
  imageFileVersion: number
  ownerUserId?: string
}

export interface CurrentUserAvatar extends UserAvatar {
  avatarId: string
}

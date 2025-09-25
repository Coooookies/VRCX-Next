export interface TableColumnMeta {
  class?: {
    th?: string
    td?: string
  }
}

export interface InstancePresentUser {
  userId: string
  userName: string
  profileIconFileId?: string
  profileIconFileVersion?: number
}

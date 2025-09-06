export interface InstanceUser {
  userName: string
  userId: string
  joinedAt: Date
}

export interface InstanceUserActivity {
  userName: string
  userId: string
  type: 'leave' | 'join'
  at: Date
}

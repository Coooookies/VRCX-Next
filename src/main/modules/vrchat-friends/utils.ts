import { randomUUID } from 'node:crypto'

export function generateFriendActivityId() {
  return `friactv_${randomUUID()}`
}

import type {
  InstanceUser,
  InstanceUserActivity,
  InstanceUserActivitySummary,
  InstanceUserSummary,
  LocationInstance
} from '@shared/definition/vrchat-instances'

export type InstancePresentProcessHandler = (
  users: InstanceUserSummary[],
  activities: InstanceUserActivitySummary[]
) => void

export interface InstanceData {
  location: LocationInstance
  joinedAt: Date
  leftAt: Date | null
  isLeft: boolean
  isCurrentUserInInstance: boolean
  users: InstanceUser[]
  userActivities: InstanceUserActivity[]
}

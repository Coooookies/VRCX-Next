import type {
  InstanceEventMessage,
  InstanceEvents,
  InstanceUser,
  InstanceUserSummary,
  LocationInstance
} from '@shared/definition/vrchat-instances'

export type InstancePresentProcessHandler = (
  users: InstanceUserSummary[],
  events: InstanceEventMessage[]
) => void

export interface InstanceData {
  location: LocationInstance
  joinedAt: Date
  leftAt: Date | null
  isLeft: boolean
  isCurrentUserInInstance: boolean
  users: InstanceUser[]
  userEvents: InstanceUserPresentEvent[]
  videoEvents: InstanceEventMessage[]
}

export interface InstanceUserPresentEvent {
  userId: string
  userName: string
  recordedAt: Date
  type:
    | typeof InstanceEvents.UserJoin
    | typeof InstanceEvents.UserLeave
    | typeof InstanceEvents.UserPresent
    | typeof InstanceEvents.UserRemain
}

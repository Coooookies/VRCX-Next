import type {
  InstanceEventMessage,
  InstanceUser,
  InstanceUserEvents,
  LocationInstance
} from '@shared/definition/vrchat-instances'

export interface LogInstanceSummary {
  locationInstance: LocationInstance
  recordId: string
  joinedAt: Date
  leftAt: Date | null
  isJoined: boolean
  isInInstance: boolean
  players: InstanceUser[]
  events: InstanceEventMessage[]
}

export interface InstanceUserPresentEvent {
  userId: string
  userName: string
  recordedAt: Date
  type: InstanceUserEvents
}

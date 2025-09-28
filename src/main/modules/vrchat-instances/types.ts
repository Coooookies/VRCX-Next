import type {
  InstanceEventMessage,
  InstanceUser,
  InstanceUserEvents,
  InstanceUserSummary,
  LocationInstance,
  LocationOwner
} from '@shared/definition/vrchat-instances'
import { WorldDetail } from '@shared/definition/vrchat-worlds'

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
  type: InstanceUserEvents
}

export interface CurrentInstancePlayerActivityEvent {
  userId: string
  userName: string
}

export interface CurrentInstanceState {
  isListening: boolean
  isInitialBatchMode: boolean
  isPending: boolean
  isCurrentUserInInstance: boolean
}

export type CurrentInstanceEmitEvent = {
  'instance:left': (recordId: string) => void
  'instance:joined': (recordId: string, location: LocationInstance) => void
  'instance:joined-complete': (
    recordId: string,
    location: LocationInstance,
    world: WorldDetail | null,
    owner: LocationOwner | null
  ) => void
  'instance:world-summary-initialized': (recordId: string, detail: WorldDetail | null) => void
  'instance:owner-summary-initialized': (recordId: string, detail: LocationOwner | null) => void
  'instance:present-progress': (
    recordId: string,
    users: InstanceUserSummary[],
    events: InstanceEventMessage[]
  ) => void
  'instance:present-loaded': (
    recordId: string,
    users: InstanceUserSummary[],
    events: InstanceEventMessage[]
  ) => void
  'user:joined': (recordId: string, user: InstanceUserSummary) => void
  'user:left': (recordId: string, userId: string) => void
  'video:playback-load': (recordId: string, url: string) => void
  'video:playback-error': (recordId: string, reason: string) => void
  'moderation:vote-kick': (recordId: string, userName: string) => void
}

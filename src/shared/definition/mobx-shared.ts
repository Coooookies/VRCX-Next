import type { AuthenticationState } from './vrchat-authentication'
import type { LocationInstance, InstanceOwner, LocationInstanceOverview } from './vrchat-instances'
import type { CurrentUserInformation } from './vrchat-users'
import type { WorldDetail } from './vrchat-worlds'
import type { WorkflowType } from './vrchat-workflow-coordinator'

export interface AuthenticationSharedState {
  state: AuthenticationState
}

export interface WorkflowCoordinatorSharedState {
  inWorkflow: boolean
  currentWorkflow: WorkflowType | null
  total: number
  index: number
}

export interface UserStoreSharedState {
  user: CurrentUserInformation | null
  location: LocationInstanceOverview | null
}

export interface FriendSharedState {
  loading: boolean
}

export interface InstanceSharedState {}

export interface InstanceTrackerSharedState {
  recordId: string | null
  isRunning: boolean
  isInitializing: boolean
  isInInstance: boolean
  isJoined: boolean
  worldDetail: WorldDetail | null
  ownerDetail: InstanceOwner | null
  locationInstance: LocationInstance | null
  locationJoinedAt: Date | null
}

export interface NotificationSharedState {
  loading: boolean
}

export interface MiscellaneousSharedState {
  serverTimeOffset: number
}

export interface ServiceMonitorSharedState {
  vrchat: {
    isRunning: boolean
    pid: number | null
    cmd: string | null
  }
  steamvr: {
    isRunning: boolean
    pid: number | null
    cmd: string | null
  }
}

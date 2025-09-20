import type { AuthenticationState } from './vrchat-authentication'
import type { LocationInstance, LocationOwner } from './vrchat-instances'
import type { CurrentUserInformation, UserLocation } from './vrchat-users'
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

export interface UserSharedState {
  user: CurrentUserInformation | null
  location: UserLocation | null
}

export interface FriendSharedState {
  loading: boolean
}

export interface InstanceSharedState {
  currentInstance: {
    recordId: string | null
    loading: boolean
    joined: boolean
    world: WorldDetail | null
    location: LocationInstance | null
    locationOwner: LocationOwner | null
    locationJoinedAt: Date | null
  }
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

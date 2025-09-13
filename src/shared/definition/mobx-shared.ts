import type { AuthenticationState } from './vrchat-authentication'
import type { LocationInstance } from './vrchat-instances'
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
    world: WorldDetail | null
    joined: boolean
    location: LocationInstance | null
    locationJoinedAt: Date | null
    loading: boolean
  }
}

export interface NotificationSharedState {
  loading: boolean
}

export interface MiscellaneousSharedState {
  serverTimeOffset: number
}

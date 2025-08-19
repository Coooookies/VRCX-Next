import type { AuthenticationState } from './vrchat-authentication'
import type { UserInformation, UserLocation } from './vrchat-users'
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
  user: UserInformation | null
  location: UserLocation | null
}

export interface FriendSharedState {
  loading: boolean
}

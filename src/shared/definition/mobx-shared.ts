import type { AuthenticationState } from './vrchat-authentication'
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

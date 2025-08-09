import type { AuthenticationState } from './vrchat-authentication'

export interface AuthenticationSharedState {
  state: AuthenticationState
}

export interface WorkflowCoordinatorSharedState {
  inWorkflow: boolean
  currentWorkflow: 'post-logout' | 'post-login' | null
  total: number
  index: number
}

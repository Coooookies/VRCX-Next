export const WorkflowType = {
  POST_LOGIN: 'post-login',
  POST_LOGOUT: 'post-logout'
} as const

export type WorkflowType = (typeof WorkflowType)[keyof typeof WorkflowType]

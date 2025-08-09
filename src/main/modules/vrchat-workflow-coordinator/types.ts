export type WorkflowTaskInterrupter = (reason: WorkflowTaskError) => void
export type WorkflowTaskHandler = (interrupter: WorkflowTaskInterrupter) => Promise<void> | void

export interface WorkflowTaskError extends Error {
  message: string
  code?: string
  cause?: unknown
}

export interface WorkflowTaskHandlerInstance {
  name: string
  priority: number
  handler: WorkflowTaskHandler
}

export type WorkflowProcessResult =
  | {
      interrupted: true
      name: string
      reason: WorkflowTaskError
    }
  | {
      interrupted: false
    }

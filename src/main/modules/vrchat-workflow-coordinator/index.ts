import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
import { WorkflowType } from '@shared/definition/vrchat-workflow-coordinator'
import type { MobxState } from '../mobx-state'
import type { VRChatAuthentication } from '../vrchat-authentication'
import type { WorkflowCoordinatorSharedState } from '@shared/definition/mobx-shared'
import type {
  WorkflowProcessResult,
  WorkflowTaskError,
  WorkflowTaskHandler,
  WorkflowTaskHandlerInstance,
  WorkflowTaskInterrupter
} from './types'

export class VRChatWorkflowCoordinator extends Module<{
  'workflow:start': (workflowType: WorkflowType, total: number) => void
  'workflow:complete': (workflowType: WorkflowType) => void
  'workflow:interrupted': (
    workflowType: WorkflowType,
    taskName: string,
    reason: Readonly<WorkflowTaskError>
  ) => void
}> {
  @Dependency('VRChatAuthentication') declare private auth: VRChatAuthentication
  @Dependency('MobxState') declare private mobx: MobxState

  private readonly logger = createLogger(this.moduleId)

  private postLogoutWorkflows = new Set<WorkflowTaskHandlerInstance>()
  private postLoginWorkflows = new Set<WorkflowTaskHandlerInstance>()
  private $!: WorkflowCoordinatorSharedState

  protected async onInit(): Promise<void> {
    this.bindEvents()
    this.$ = this.mobx.observable(
      this.moduleId,
      {
        inWorkflow: false,
        currentWorkflow: null,
        total: 0,
        index: 0
      },
      ['currentWorkflow', 'inWorkflow', 'index', 'total']
    )
  }

  private bindEvents() {
    this.auth.on('state:update', ({ type }) => {
      switch (type) {
        case 'unauthenticated': {
          this.processPostLogoutWorkflows()
          break
        }
        case 'authenticated': {
          this.processPostLoginWorkflows()
          break
        }
      }
    })

    this.on('workflow:start', (workflowType, total) => {
      this.logger.info(`Processing ${total} post ${workflowType} workflows...`)
    })

    this.on('workflow:complete', (workflowType) => {
      this.logger.info(`Post ${workflowType} workflow completed.`)
    })

    this.on('workflow:interrupted', (workflowType, taskName, reason) => {
      this.logger.warn(`Post ${workflowType} workflow interrupted by task "${taskName}":`, reason)
    })
  }

  private async processPostLogoutWorkflows() {
    const tasks = [...this.postLogoutWorkflows]
    const callback = (name: string, index: number) => {
      this.logger.info(`Post logout workflow ${name} completed (${index + 1}/${tasks.length})`)
      this.mobx.action(() => {
        this.$.index = index + 1
      })
    }

    this.emit('workflow:start', WorkflowType.POST_LOGOUT, tasks.length)
    this.mobx.action(() => {
      this.$.inWorkflow = true
      this.$.total = tasks.length
      this.$.currentWorkflow = WorkflowType.POST_LOGOUT
    })

    const result = await this.processWorkflows(tasks, callback)

    this.mobx.action(() => {
      this.$.inWorkflow = false
      this.$.total = 0
      this.$.currentWorkflow = null
    })

    if (result.interrupted) {
      this.emit('workflow:interrupted', WorkflowType.POST_LOGOUT, result.name, result.reason)
    } else {
      this.emit('workflow:complete', WorkflowType.POST_LOGOUT)
    }
  }

  private async processPostLoginWorkflows() {
    const tasks = [...this.postLoginWorkflows]
    const callback = (name: string, index: number) => {
      this.logger.info(`Post login workflow ${name} completed (${index + 1}/${tasks.length})`)
      this.mobx.action(() => {
        this.$.index = index + 1
      })
    }

    this.emit('workflow:start', WorkflowType.POST_LOGIN, tasks.length)
    this.mobx.action(() => {
      this.$.inWorkflow = true
      this.$.total = tasks.length
      this.$.currentWorkflow = WorkflowType.POST_LOGIN
    })

    const result = await this.processWorkflows(tasks, callback)

    this.mobx.action(() => {
      this.$.inWorkflow = false
      this.$.total = 0
      this.$.currentWorkflow = null
    })

    if (result.interrupted) {
      this.emit('workflow:interrupted', WorkflowType.POST_LOGIN, result.name, result.reason)
    } else {
      this.emit('workflow:complete', WorkflowType.POST_LOGIN)
    }
  }

  private async processWorkflows(
    workflows: WorkflowTaskHandlerInstance[],
    callback: (name: string, index: number) => void
  ): Promise<WorkflowProcessResult> {
    const queues = new Map<number, WorkflowTaskHandlerInstance[]>()

    for (const workflow of workflows) {
      queues.set(workflow.priority, [...(queues.get(workflow.priority) || []), workflow])
    }

    const sortedQueuesIndex = [...queues.keys()].sort((a, b) => a - b)
    let actionIndex = 0

    for (const index of sortedQueuesIndex) {
      let isInterrupted = false
      let interruptedName: string | null = null
      let interruptedReason: WorkflowTaskError | undefined = undefined

      const workflows = queues.get(index) || []
      const createInterrupter = (name: string): WorkflowTaskInterrupter => {
        return (reason) => {
          interruptedName = name
          isInterrupted = true
          interruptedReason = reason
        }
      }

      await Promise.allSettled(
        workflows.map((workflow) => workflow.handler(createInterrupter(workflow.name)))
      )

      if (isInterrupted) {
        return {
          interrupted: true,
          name: interruptedName!,
          reason: interruptedReason!
        }
      } else {
        for (const workflow of workflows) {
          callback(workflow.name, actionIndex++)
        }
      }
    }

    return {
      interrupted: false
    }
  }

  public registerPostLogoutTask(name: string, priority: number, handler: WorkflowTaskHandler) {
    this.postLogoutWorkflows.add({
      name,
      priority,
      handler
    })
  }

  public registerPostLoginTask(name: string, priority: number, handler: WorkflowTaskHandler) {
    this.postLoginWorkflows.add({
      name,
      priority,
      handler
    })
  }
}

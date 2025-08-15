import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
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

export class VRChatWorkflowCoordinator extends Module<{}> {
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
  }

  private async processPostLogoutWorkflows() {
    const tasks = [...this.postLogoutWorkflows]
    const callback = (name: string, index: number) => {
      this.logger.info(`Post logout workflow ${name} completed (${index + 1}/${tasks.length})`)
      this.mobx.action(() => {
        this.$.index = index + 1
      })
    }

    this.logger.info(`Processing ${tasks.length} post logout workflows...`)
    this.mobx.action(() => {
      this.$.inWorkflow = true
      this.$.total = tasks.length
      this.$.currentWorkflow = 'post-logout'
    })

    const result = await this.processWorkflows(tasks, callback)

    this.mobx.action(() => {
      this.$.inWorkflow = false
      this.$.total = 0
      this.$.currentWorkflow = null
    })

    if (result.interrupted) {
      this.logger.error(`Post logout workflow interrupted: ${result.name}`, result.reason.message)
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

    this.logger.info(`Processing ${tasks.length} post login workflows...`)
    this.mobx.action(() => {
      this.$.inWorkflow = true
      this.$.total = tasks.length
      this.$.currentWorkflow = 'post-login'
    })

    const result = await this.processWorkflows(tasks, callback)

    this.mobx.action(() => {
      this.$.inWorkflow = false
      this.$.total = 0
      this.$.currentWorkflow = null
    })

    if (result.interrupted) {
      this.logger.error(`Post login workflow interrupted: ${result.name}`, result.reason.message)
    }
  }

  private async processWorkflows(
    workflows: WorkflowTaskHandlerInstance[],
    callback: (name: string, index: number) => void
  ): Promise<WorkflowProcessResult> {
    const sortedWorkflows = workflows.sort((a, b) => a.priority - b.priority)

    for (let i = 0; i < sortedWorkflows.length; i++) {
      let isInterrupted = false
      let interruptedReason: WorkflowTaskError | undefined = undefined

      const workflow = sortedWorkflows[i]
      const interrupter: WorkflowTaskInterrupter = (reason) => {
        isInterrupted = true
        interruptedReason = reason
      }

      await workflow.handler(interrupter)

      if (isInterrupted) {
        return {
          interrupted: true,
          name: workflow.name,
          reason: interruptedReason!
        }
      } else {
        callback(workflow.name, i)
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

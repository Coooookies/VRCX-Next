import { Dependency, Module } from '@shared/module-constructor'
import type { MobxRenderer } from './mobx-renderer'
import type { WorkflowCoordinatorSharedState } from '@shared/definition/mobx-shared'

export class VRChatWorkflowCoordinator extends Module {
  @Dependency('MobxRenderer') declare private mobx: MobxRenderer

  private $!: WorkflowCoordinatorSharedState

  protected onInit(): void {
    this.$ = this.mobx.use<WorkflowCoordinatorSharedState>(this.moduleId)
  }

  public get state() {
    return this.$
  }
}

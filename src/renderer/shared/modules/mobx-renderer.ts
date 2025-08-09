import lodash from 'lodash'
import { markRaw, reactive } from 'vue'
import { Dependency, Module } from '@shared/module-constructor'
import type { IPCRenderer } from './ipc'

export class MobxRenderer extends Module {
  @Dependency('IPCRenderer') declare private ipc: IPCRenderer

  private readonly reactives = new Map<string, object>()

  protected async onInit() {
    this.bindEvents()
    await this.preloadAllStates()
  }

  private bindEvents() {
    this.ipc.listener.on('mobx-state:target:update', (_, namespace, path, value) => {
      this.updateReactive(namespace, path, value)
    })
  }

  public use<T>(namespace: string): T {
    return this.reactives.get(namespace) as T
  }

  private updateReactive(namespace: string, path: string, value: unknown) {
    const target = this.reactives.get(namespace)
    const newValue = lodash.isObject(value) ? markRaw(value) : value
    if (!target) {
      throw new Error(`No reactive target found for namespace: ${namespace}`)
    }

    lodash.set(target, path, newValue)
  }

  private async preloadAllStates() {
    const targets = await this.getAllOriginalTargets()

    for (const [namespace, target] of Object.entries(targets)) {
      this.reactives.set(namespace, reactive(target))
    }
  }

  private getAllOriginalTargets() {
    return this.ipc.emitter.invoke('mobx-state:get-all-original-targets')
  }
}

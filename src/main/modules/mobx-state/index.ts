import lodash, { isObject } from 'lodash'
import { createLogger } from '@main/logger'
import { configure, isObservable, observable, reaction, runInAction, toJS } from 'mobx'
import { Dependency, Module } from '@shared/module-constructor'
import type { IPCModule } from '../ipc'
import type { RegisteredTargetInstance, TargetPaths } from './types'

configure({ enforceActions: 'observed' })

export class MobxState extends Module<{
  'target:update': (namespace: string, path: string, value: unknown) => void
}> {
  @Dependency('IPCModule') declare private ipc: IPCModule

  private readonly logger = createLogger(this.moduleId)
  private readonly disposers = new Map<string, () => void>()
  private readonly registeredStates = new Map<string, RegisteredTargetInstance>()

  protected onInit(): void {
    this.bindEvents()
    this.bindInvokes()
  }

  protected onDestroy(): void {
    this.disposers.forEach((disposer) => disposer())
  }

  private bindEvents(): void {
    this.on('target:update', (namespace, path, value) => {
      this.ipc.send('mobx-state:target:update', namespace, path, value)
      this.logger.trace(
        `Target update: ${namespace}.${path} =`,
        isObject(value) ? JSON.stringify(value) : value
      )
    })
  }

  private bindInvokes(): void {
    this.ipc.listener.handle('mobx-state:get-all-original-targets', () => this.allOriginalTargets)
  }

  public observable<T extends object>(
    namespace: string,
    target: T,
    paths: TargetPaths<T> | TargetPaths<T>[]
  ): T {
    const reactionPaths = Array.isArray(paths) ? paths : [paths]
    const observableTarget = observable(target)

    for (const path of reactionPaths) {
      const key = `${namespace}.${path}`

      if (this.disposers.has(key)) {
        this.logger.warn(`Reaction for ${key} already exists, skipping`)
        continue
      }

      const disposer = reaction(
        () => lodash.get(observableTarget, path),
        (newValue) => {
          this.emit(
            'target:update',
            namespace,
            path,
            isObservable(newValue) ? toJS(newValue) : newValue
          )
        }
      )

      this.disposers.set(key, disposer)
    }

    // Register the target instance
    this.registeredStates.set(namespace, {
      target: observableTarget
    })

    return observableTarget
  }

  public action(callback: () => void): void {
    runInAction(callback)
  }

  private get allOriginalTargets(): Record<string, object> {
    const targets: Record<string, object> = {}
    this.registeredStates.forEach((v, n) => (targets[n] = toJS(v.target)))
    return targets
  }
}

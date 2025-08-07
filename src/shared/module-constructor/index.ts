import Nanobus from 'nanobus'

import { Module } from './module'
import { ModuleConstructor } from './types'

export { Module }
export { Dependency } from './injector'

export class ModuleManager extends Nanobus<{
  'module:load-complete': (moduleCount: number) => void
  'module:inited': (moduleIdentifier: string) => void
  'module:destroyed': (moduleIdentifier: string) => void
}> {
  private instances: Map<string, Module> = new Map()
  private serviceRegistry: Map<string, new (moduleId: string) => Module> = new Map()
  private setupOrder: string[] = []

  register(moduleIdentifier: string, constructor: ModuleConstructor): void {
    this.serviceRegistry.set(moduleIdentifier, constructor)
  }

  resolve<T extends Module>(moduleIdentifier: string): T {
    const instance = this.instances.get(moduleIdentifier)
    if (!instance) {
      throw new Error(`Service ${moduleIdentifier} not found`)
    }
    return instance as T
  }

  async setup(): Promise<void> {
    const dependencyGraph: Map<string, Set<string>> = new Map()
    for (const [identifier, constructor] of this.serviceRegistry.entries()) {
      const injectedServices = Reflect.getMetadata('injected:services', constructor.prototype) || {}
      dependencyGraph.set(identifier, new Set(Object.values(injectedServices) as string[]))
    }

    const sortedServices = this.sortDependencyGraph(dependencyGraph)
    this.setupOrder = sortedServices

    for (const identifier of sortedServices) {
      if (this.instances.has(identifier)) continue

      const constructor = this.serviceRegistry.get(identifier)
      if (!constructor) continue

      const instance = new constructor(identifier)
      this.instances.set(identifier, instance)

      const injectedServices = Reflect.getMetadata('injected:services', constructor.prototype) || {}
      for (const [propertyName, dependencyId] of Object.entries(injectedServices)) {
        instance[propertyName] = this.resolve(dependencyId as string)
      }

      await instance._init()
      this.emit('module:inited', identifier)
    }

    for (const identifier of sortedServices) {
      const instance = this.instances.get(identifier)
      if (instance) {
        instance._load()
      }
    }

    this.emit('module:load-complete', this.instances.size)
  }

  destroy(): void {
    for (const identifier of [...this.setupOrder].reverse()) {
      const instance = this.instances.get(identifier)
      if (instance) {
        instance._destroy()
        this.instances.delete(identifier)
        this.emit('module:destroyed', identifier)
      }
    }
    this.setupOrder = []
  }

  private sortDependencyGraph(graph: Map<string, Set<string>>): string[] {
    const sorted: string[] = []
    const visited: Set<string> = new Set()
    const tempMark: Set<string> = new Set()

    const visit = (node: string): void => {
      if (tempMark.has(node)) {
        throw new Error(`Circular dependency detected: ${node}`)
      }

      if (!visited.has(node)) {
        tempMark.add(node)
        const dependencies = graph.get(node) || new Set()
        for (const dep of dependencies) {
          visit(dep)
        }
        tempMark.delete(node)
        visited.add(node)
        sorted.push(node)
      }
    }

    for (const node of graph.keys()) {
      visit(node)
    }
    return sorted
  }
}

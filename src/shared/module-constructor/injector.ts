import type { Module } from './module'

export function Dependency(serviceIdentifier: string) {
  return function <T extends Module>(target: T, propertyKey: string) {
    const injectedServices = Reflect.getMetadata('injected:services', target) || {}
    injectedServices[propertyKey] = serviceIdentifier
    Reflect.defineMetadata('injected:services', injectedServices, target)
  }
}

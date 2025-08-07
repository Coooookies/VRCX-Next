import { Module } from './module'

export type ModuleConstructor = new (moduleId: string) => Module

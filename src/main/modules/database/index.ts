import { DataSource } from 'typeorm'
import { Module } from '@shared/module-constructor'
import dataSource from './data-source'

export class Database extends Module {
  private dataSource!: DataSource

  protected async onInit(): Promise<void> {
    this.dataSource = dataSource
    await dataSource.initialize()
    await dataSource.runMigrations()
  }

  protected async onDestroy(): Promise<void> {
    await this.dataSource.destroy()
  }

  public get source(): DataSource {
    return this.dataSource
  }
}

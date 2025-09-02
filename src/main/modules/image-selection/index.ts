import { dialog } from 'electron'
import { Dependency, Module } from '@shared/module-constructor'
import { ImageSelectionRepository } from './repository'
import type { Database } from '../database'

export class ImageSelection extends Module {
  @Dependency('Database') declare private database: Database
  private repository!: ImageSelectionRepository

  protected onInit(): void {
    this.repository = new ImageSelectionRepository(this.database)
  }

  public async openImageSelectionDialog() {
    const returnValue = await dialog.showOpenDialog({ properties: ['openFile', 'createDirectory'] })

    if (returnValue.canceled) {
      return null
    }
  }
}

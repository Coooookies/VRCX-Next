import { randomUUID } from 'node:crypto'
import { basename, extname } from 'node:path'
import { dialog } from 'electron'
import { insertIf } from '@shared/utils/array'
import { IMAGE_SELECT_FORMAT_FILTERS } from './constants'
import type { MainWindow } from '../main-window'
import type { LoggerFactory } from '@main/logger'
import type { ImageSelectionRepository } from './repository'
import type { ImageSelectionDialogReturnValue } from './types'
import type { ImageSelectionEntity } from '../database/entities/selection-images'
import type { ImageSelectionInstance } from '@shared/definition/image-selection'

export class ImageSelectionOperation {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly window: MainWindow,
    private readonly repository: ImageSelectionRepository
  ) {}

  private async openDialog(
    title: string,
    multiSelections?: boolean
  ): Promise<ImageSelectionDialogReturnValue[] | null> {
    const returnValue = await dialog.showOpenDialog(this.window.window!, {
      title,
      properties: ['openFile', 'createDirectory', ...insertIf(multiSelections, 'multiSelections')],
      filters: [
        {
          name: 'Images',
          extensions: IMAGE_SELECT_FORMAT_FILTERS
        }
      ]
    })

    if (returnValue.canceled) {
      return null
    }

    return returnValue.filePaths.map((filePath, index) => ({
      path: filePath,
      bookmark: returnValue.bookmarks?.[index] || null
    }))
  }

  private processImageSelections(
    selections: ImageSelectionDialogReturnValue[]
  ): ImageSelectionEntity[] {
    return selections.map((selection) => {
      const ext = extname(selection.path)
      const name = basename(selection.path, ext)
      const _ext = ext.toLowerCase().replace(/^\./, '')
      return {
        selectionId: `imgsel_${randomUUID()}`,
        fileName: name,
        fileExtension: _ext,
        path: selection.path,
        macosBookmark: selection.bookmark || undefined,
        recordedAt: new Date()
      }
    })
  }

  public async selectImage(
    title: string,
    multiSelections?: boolean
  ): Promise<ImageSelectionInstance[] | null> {
    const selections = await this.openDialog(title, multiSelections)
    if (!selections) {
      this.logger.info('Image selection canceled')
      return null
    }

    const entities = this.processImageSelections(selections)
    await this.repository.upsertSelections(entities)
    return entities.map((entity) => ({
      ...entity,
      exist: true,
      recordedAt: entity.recordedAt!
    }))
  }
}

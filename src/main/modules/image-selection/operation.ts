import { randomUUID } from 'node:crypto'
import { basename, extname } from 'node:path'
import { dialog } from 'electron'
import { insertIf } from '@shared/utils/array'
import type { LoggerFactory } from '@main/logger'
import type { ImageSelectionRepository } from './repository'
import type { ImageSelectionDialogReturnValue } from './types'
import type { ImageSelectionEntity } from '../database/entities/image-selection'

export class ImageSelectionOperation {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: ImageSelectionRepository
  ) {}

  private async openDialog(
    multiSelections?: boolean
  ): Promise<ImageSelectionDialogReturnValue[] | null> {
    const returnValue = await dialog.showOpenDialog({
      properties: ['openFile', 'createDirectory', ...insertIf(multiSelections, 'multiSelections')]
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
      const ext = extname(selection.path).toLowerCase()
      const name = basename(selection.path, ext)
      return {
        selectionId: `imgsel_${randomUUID()}`,
        fileName: name,
        fileExtension: ext,
        path: selection.path,
        macosBookmark: selection.bookmark || undefined,
        recordedAt: new Date()
      }
    })
  }

  public async selectAndCacheSelection() {
    const selections = await this.openDialog(true)

    if (!selections) {
      this.logger.info('Image selection canceled')
      return
    }

    const entities = this.processImageSelections(selections)
    await this.repository.upsertSelections(entities)
  }
}

import { dialog } from 'electron'
import { insertIf } from '@shared/utils/array'
import type { LoggerFactory } from '@main/logger'
import type { ImageSelectionRepository } from './repository'
import type { ImageSelectionDialogReturnValue } from './types'

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

  private async processImageSelection() {}

  public async selectAndCacheSelection() {
    const selections = await this.openDialog(true)

    if (!selections) {
      this.logger.info('Image selection canceled')
      return
    }
  }
}

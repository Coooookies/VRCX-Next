import type { IPCModule } from '../ipc'
import type { ImageSelectionRepository } from './repository'
import type { ImageSelectionOperation } from './operation'

export class ImageSelectionIPCBinding {
  constructor(
    private ipc: IPCModule,
    private repository: ImageSelectionRepository,
    private operation: ImageSelectionOperation
  ) {}

  public bindInvokes() {
    this.ipc.listener.handle('image-selection:get-selection', (_, selectionId) => {
      return this.repository.resolveImageSelection(selectionId)
    })

    this.ipc.listener.handle('image-selection:get-latest-selections', (_, limit) => {
      return this.repository.resolveLatestImageSelections(limit)
    })

    this.ipc.listener.handle(
      'image-selection:select-image',
      (_, title: string, multiSelections?: boolean) => {
        return this.operation.selectImage(title, multiSelections)
      }
    )
  }
}

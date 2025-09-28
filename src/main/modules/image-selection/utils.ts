import { randomUUID } from 'node:crypto'

export function generateImageSelectionId() {
  return `imgsel_${randomUUID()}`
}

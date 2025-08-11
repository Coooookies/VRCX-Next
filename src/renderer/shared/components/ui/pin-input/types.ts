export interface PinInputFocusPayload {
  index: number
  focus: () => void
}

export type PinInputType = 'text' | 'number'

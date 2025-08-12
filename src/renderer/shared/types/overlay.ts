import type { Component } from 'vue'
import type { ComponentProps, ComponentEmit } from 'vue-component-type-helpers'

export type CloseEventArgType<T> = T extends (event: 'close', args_0: infer R) => void ? R : never

export type OverlayOptions<OverlayAttrs = Record<string, unknown>> = {
  defaultOpen?: boolean
  props?: OverlayAttrs
  destroyOnClose?: boolean
}

export interface ManagedOverlayOptionsPrivate<T extends Component> {
  component?: T
  id: symbol
  isMounted: boolean
  isOpen: boolean
  originalProps?: ComponentProps<T>
  resolvePromise?: (value: unknown) => void
}
export type Overlay = OverlayOptions<Component> & ManagedOverlayOptionsPrivate<Component>

export type OverlayInstance<T extends Component> = Omit<
  ManagedOverlayOptionsPrivate<T>,
  'component'
> & {
  id: symbol
  open: (props?: ComponentProps<T>) => OpenedOverlay<T>
  close: (value?: unknown) => void
  patch: (props: Partial<ComponentProps<T>>) => void
}

export type OpenedOverlay<T extends Component> = Omit<
  OverlayInstance<T>,
  'open' | 'close' | 'patch' | 'modelValue' | 'resolvePromise'
> & {
  result: Promise<CloseEventArgType<ComponentEmit<T>>>
}

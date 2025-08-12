// https://ui.nuxt.com/composables/use-overlay
import { reactive, markRaw, shallowReactive } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import type { Component } from 'vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { OpenedOverlay, Overlay, OverlayInstance, OverlayOptions } from '../types/overlay'

function createOverlayhook() {
  const overlays = shallowReactive<Overlay[]>([])

  const create = <T extends Component>(
    component: T,
    _options?: OverlayOptions<ComponentProps<T>>
  ): OverlayInstance<T> => {
    const { props, defaultOpen, destroyOnClose } = _options || {}

    const options = reactive<Overlay>({
      id: Symbol(),
      isOpen: !!defaultOpen,
      component: markRaw(component!),
      isMounted: !!defaultOpen,
      destroyOnClose: !!destroyOnClose,
      originalProps: props || {},
      props: { ...(props || {}) }
    })

    overlays.push(options)

    return {
      ...options,
      open: <T extends Component>(props?: ComponentProps<T>) => open(options.id, props),
      close: (value) => close(options.id, value),
      patch: <T extends Component>(props: Partial<ComponentProps<T>>) => patch(options.id, props)
    }
  }

  const open = <T extends Component>(id: symbol, props?: ComponentProps<T>): OpenedOverlay<T> => {
    const overlay = getOverlay(id)

    // If props are provided, update the overlay's props
    if (props) {
      patch(overlay.id, props)
    } else {
      patch(overlay.id, overlay.originalProps)
    }

    overlay.isOpen = true
    overlay.isMounted = true

    return {
      id,
      isMounted: overlay.isMounted,
      isOpen: overlay.isOpen,
      result: new Promise<unknown>((resolve) => (overlay.resolvePromise = resolve))
    } as OpenedOverlay<T>
  }

  const close = (id: symbol, value?: unknown): void => {
    const overlay = getOverlay(id)

    overlay.isOpen = false

    // Resolve the promise if it exists
    if (overlay.resolvePromise) {
      overlay.resolvePromise(value)
      overlay.resolvePromise = undefined
    }
  }

  const closeAll = (): void => {
    overlays.forEach((overlay) => close(overlay.id))
  }

  const unmount = (id: symbol): void => {
    const overlay = getOverlay(id)

    overlay.isMounted = false

    if (overlay.destroyOnClose) {
      const index = overlays.findIndex((overlay) => overlay.id === id)
      overlays.splice(index, 1)
    }
  }

  const patch = <T extends Component>(id: symbol, props: Partial<ComponentProps<T>>): void => {
    const overlay = getOverlay(id)

    overlay.props = { ...props }
  }

  const getOverlay = (id: symbol): Overlay => {
    const overlay = overlays.find((overlay) => overlay.id === id)

    if (!overlay) {
      throw new Error('Overlay not found')
    }

    return overlay
  }

  const isOpen = (id: symbol): boolean => {
    const overlay = getOverlay(id)

    return overlay.isOpen
  }

  return {
    overlays,
    open,
    close,
    closeAll,
    create,
    patch,
    unmount,
    isOpen
  }
}

export const useOverlay = /* @__PURE__ */ createSharedComposable(createOverlayhook)

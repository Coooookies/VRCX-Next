import { Module } from '@shared/module-constructor'

export class AppLoader extends Module {
  static ANIMATION_DURATION = 200

  loaded(): void {
    setTimeout(
      () => postMessage({ payload: 'preload:removeLoading' }, '*'),
      AppLoader.ANIMATION_DURATION
    )
  }
}

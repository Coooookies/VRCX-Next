import icon from '@shared/assets/vector/loading-screen-title-zypher.svg?raw'

export default class AppLoader {
  private static className = `loader-icon`
  private static classHideDuration = 320
  private static conditionStatus: DocumentReadyState[] = ['complete', 'interactive']
  private static styleContent = `
    .${AppLoader.className} {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      transform-origin: 0% 0%;
      width: 180px;
      height: 108px;
    }

    .${AppLoader.className} img {
      width: 100%;
      height: 100%;
    }

    .app-loading-wrap {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0;
      padding: 0;
      border: 0;
      background-color: oklch(0.18 0 0);
      overflow: hidden;
      z-index: 100000;
      -webkit-app-region: drag;
      -webkit-user-drag: none;
    }

    .app-loading-wrap.hide {
      opacity: 0;
      transition: opacity ${AppLoader.classHideDuration}ms;
    }

    .app-loading-wrap.hide .${AppLoader.className} {
      transform: scale(1.1) translate(-50%, -50%);
      transition: transform ${AppLoader.classHideDuration / 2}ms;
    }
  `
  private static oStyle = document.createElement('style')
  private static oDiv = document.createElement('div')

  static {
    AppLoader.oStyle.id = 'app-loading-style'
    AppLoader.oStyle.innerHTML = AppLoader.styleContent
    AppLoader.oDiv.className = 'app-loading-wrap'
    AppLoader.oDiv.innerHTML = `<div class="${AppLoader.className}">${icon}</div>`
  }

  static whenReady(): Promise<boolean> {
    return new Promise((resolve) => {
      const checkReadyState = (): void => {
        if (AppLoader.conditionStatus.includes(document.readyState)) {
          resolve(true)
          document.removeEventListener('readystatechange', checkReadyState)
        }
      }

      checkReadyState() // Initial check
      document.addEventListener('readystatechange', checkReadyState)
    })
  }

  static whenLoaded(): Promise<boolean> {
    return new Promise((resolve) => {
      window.addEventListener('message', (ev) => {
        if (ev.data.payload === 'preload:removeLoading') {
          resolve(true)
        }
      })
    })
  }

  static appendLoading(): void {
    document.head.appendChild(AppLoader.oStyle)
    document.body.appendChild(AppLoader.oDiv)
  }

  static removeLoading(): void {
    AppLoader.oDiv.classList.add('hide')
    setTimeout(() => {
      AppLoader.oStyle.remove()
      AppLoader.oDiv.remove()
    }, AppLoader.classHideDuration)
  }
}

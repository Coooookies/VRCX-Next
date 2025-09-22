import PlatformWindowsIcon from '@shared/assets/vector/platform-windows.svg?component'
import PlatformAndroidIcon from '@shared/assets/vector/platform-android.svg?component'
import PlatformAppleIcon from '@shared/assets/vector/platform-apple.svg?component'
import { Platform } from '@shared/definition/vrchat-api-response'
import type { PlatformDefinitionItem } from './types'

export const PLATFORM_MAPPING: Pick<
  Record<Platform, PlatformDefinitionItem>,
  typeof Platform.Standalonewindows | typeof Platform.Android | typeof Platform.IOS
> = {
  [Platform.Standalonewindows]: {
    label: 'platform.standalonewindows',
    icon: PlatformWindowsIcon,
    color: '#298DFF'
  },
  [Platform.Android]: {
    label: 'platform.android',
    icon: PlatformAndroidIcon,
    color: '#3DDC84'
  },
  [Platform.IOS]: {
    label: 'platform.ios',
    icon: PlatformAppleIcon,
    color: 'var(--foreground)'
  }
}

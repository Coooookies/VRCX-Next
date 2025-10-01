import { LocationInstanceGroupType } from '@shared/definition/vrchat-instances'
import type { LocationInstance, LocationInstanceGroup } from '@shared/definition/vrchat-instances'

export function isSameLocationInstance(
  currentLocation: LocationInstance | null,
  nextLocation: LocationInstance | null
): boolean {
  return !!currentLocation && !!nextLocation && nextLocation.location === currentLocation.location
}

export function isGroupInstance(location: LocationInstance): location is LocationInstanceGroup {
  return (
    location.type === LocationInstanceGroupType.GroupPublic ||
    location.type === LocationInstanceGroupType.GroupPlus ||
    location.type === LocationInstanceGroupType.Group
  )
}

export function isSecurityAssetUrl(url: string) {
  return url.includes('security')
}

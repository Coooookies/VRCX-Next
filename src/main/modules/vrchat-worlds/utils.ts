import { LocationInstanceGroupType } from '@shared/definition/vrchat-instances'
import type { LocationInstance, LocationInstanceSummary } from '@shared/definition/vrchat-instances'

export function isSameLocation(
  currentLocation: LocationInstance | LocationInstanceSummary | null,
  nextLocation: LocationInstance | LocationInstanceSummary | null
): boolean {
  return (
    !!currentLocation &&
    !!nextLocation &&
    nextLocation.worldId === currentLocation.worldId &&
    nextLocation.name === currentLocation.name
  )
}

export function isGroupInstance(location: LocationInstance | LocationInstanceSummary) {
  return (
    location.type === LocationInstanceGroupType.GroupPublic ||
    location.type === LocationInstanceGroupType.GroupPlus ||
    location.type === LocationInstanceGroupType.Group
  )
}

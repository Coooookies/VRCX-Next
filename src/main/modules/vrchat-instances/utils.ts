import { v5 as uuidv5 } from 'uuid'
import { INSTANCE_RECORD_NAMESPACE, INSTANCE_RECORD_EVENT_NAMESPACE } from './constants'
import type { InstanceEvents } from '@shared/definition/vrchat-instances'

export function generateRecordId(worldId: string, instanceName: string, date: Date): string {
  const timestamp = date.getTime()
  const instanceKey = `${worldId}:${instanceName}:${timestamp}`
  return `visinst_${uuidv5(instanceKey, INSTANCE_RECORD_NAMESPACE)}`
}

export function generateEventId(
  recordId: string,
  type: InstanceEvents,
  keyword: string,
  date: Date
) {
  const timestamp = date.getTime()
  const eventKey = `${recordId}:${type}:${keyword}:${timestamp}`
  return `visinstevt_${uuidv5(eventKey, INSTANCE_RECORD_EVENT_NAMESPACE)}`
}

import { LocationInstanceGroupType } from '@shared/definition/vrchat-instances'
import type { LocationInstance, LocationInstanceGroup } from '@shared/definition/vrchat-instances'

export function isSameLocationInstance(
  current: LocationInstance | null,
  next: LocationInstance | null
): boolean {
  if (current === next) return true
  if (!current || !next) return false
  return current.location === next.location
}

export function isGroupInstance(location: LocationInstance): location is LocationInstanceGroup {
  return (
    location.type === LocationInstanceGroupType.GroupPublic ||
    location.type === LocationInstanceGroupType.GroupPlus ||
    location.type === LocationInstanceGroupType.Group
  )
}

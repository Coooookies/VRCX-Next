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

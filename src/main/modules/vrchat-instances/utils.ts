import { v5 as uuidv5 } from 'uuid'
import { INSTANCE_RECORD_NAMESPACE } from './constants'

export function generateInstanceRecordId(worldId: string, instanceName, date: Date): string {
  const timestamp = date.getTime()
  const instanceKey = `${worldId}:${instanceName}:${timestamp}`
  return uuidv5(instanceKey, INSTANCE_RECORD_NAMESPACE)
}

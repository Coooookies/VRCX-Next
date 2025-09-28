import { v5 as uuidv5 } from 'uuid'

export const INSTANCE_USERS_INITIAL_BATCH_DELAY = 2000
export const INSTANCE_RECORD_NAMESPACE = uuidv5('vrcxnext:instance-record', uuidv5.DNS)

export const CURRENT_INSTANCE_LOG_EVENTS_LIMIT = 1500

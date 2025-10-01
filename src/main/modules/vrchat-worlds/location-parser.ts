// https://github.com/LunyaaDev/vrchat-location-parser/blob/main/src/index.ts

import { LOCATION_PARSER_REGEXP } from './constants'
import type { LocationInstance } from '@shared/definition/vrchat-instances'

export function parseLocation(location: string): LocationInstance | null {
  const blackList = [
    'offline',
    'offline:offline',
    'traveling',
    'traveling:traveling',
    'private',
    ''
  ]

  if (blackList.includes(location)) {
    return null
  }

  const [worldId, instanceId] = location.split(':')
  return parseInstance(worldId, instanceId)
}

export function parseInstance(worldId: string, instanceId: string): LocationInstance | null {
  const instanceIdParts: { [key: string]: string | null } = Object.fromEntries(
    instanceId.split('~').map((x) => {
      const regexRes = x.match(LOCATION_PARSER_REGEXP)
      return !regexRes?.groups?.key ? [] : [regexRes.groups.key, regexRes.groups.value || null]
    })
  )

  const instanceName = Object.keys(instanceIdParts).shift()
  if (!instanceName) {
    return null
  }

  let instance: LocationInstance = {
    location: `${worldId}:${instanceId}`,
    worldId: worldId,
    name: instanceName,
    type: 'public'
  }

  if (instanceIdParts.region) {
    instance.region = instanceIdParts.region as LocationInstance['region']
  }

  // hidden(usr_00000000-0000-0000-0000-000000000000)
  if (instanceIdParts.hidden) {
    instance = {
      ...instance,
      type: 'friends+',
      userId: instanceIdParts.hidden
    }
  }
  // friends(usr_00000000-0000-0000-0000-000000000000)
  else if (instanceIdParts.friends) {
    instance = {
      ...instance,
      type: 'friends',
      userId: instanceIdParts.friends
    }
  }
  // private(usr_00000000-0000-0000-0000-000000000000)
  // private(usr_00000000-0000-0000-0000-000000000000)~canRequestInvite
  else if (instanceIdParts.private) {
    instance = {
      ...instance,
      type: instanceIdParts.canRequestInvite ? 'invite+' : 'invite',
      userId: instanceIdParts.private
    }
  }

  // group(grp_00000000-0000-0000-0000-000000000000)
  else if (instanceIdParts.group) {
    instance = {
      ...instance,
      type:
        instanceIdParts.groupAccessType == 'public'
          ? 'groupPublic'
          : instanceIdParts.groupAccessType == 'plus'
            ? 'group+'
            : 'group',
      groupId: instanceIdParts.group,
      require18yo: 'ageGate' in instanceIdParts
    }
  }

  return instance
}

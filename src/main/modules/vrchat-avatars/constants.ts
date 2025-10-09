export const SAVED_AVATAR_REFERENCE_ENTITY_EXPIRE_DELAY = 1000 * 60 * 60 * 24 * 14 // 14 days
export const AVATAR_REFERENCE_ENTITIES_QUERY_THREAD_SIZE = 10
export const AVATAR_REFERENCE_IMAGE_FILE_PATTERN_REGEXP =
  /^Avatar - (?<avatarname>.+?) - Image - (?<unityversion>\d+․\d+․\w+\d*)_(?<assetversion>\d+)_(?<platform>[^_]+)_(?<releasestate>\w+)$/

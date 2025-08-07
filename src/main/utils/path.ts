import path from 'node:path'

const ESCAPE = '\\'
const WRONG_SEPARATOR_FILE_SYSTEM = path.sep === path.win32.sep ? path.posix.sep : path.win32.sep

const RGX_WRONG_SEPARATOR_FILE_SYSTEM = new RegExp(ESCAPE + WRONG_SEPARATOR_FILE_SYSTEM, 'g')
const RGX_WRONG_SEPARATOR_URL = new RegExp(ESCAPE + path.win32.sep, 'g')

export function startsWithPath(baseDir: string, targetDir: string): boolean {
  if (baseDir === targetDir) {
    return true
  }

  const relative = getRelativePath(baseDir, targetDir)
  return !relative.startsWith('..') && !path.isAbsolute(relative)
}

export function getRelativePath(baseDir: string, targetDir: string): string {
  if (baseDir === targetDir) {
    return ''
  }

  const base = path.normalize(baseDir + path.sep)
  const target = path.normalize(targetDir)
  const relative = path.relative(base, target)
  return relative
}

export function extractPathParameters<T extends string = never>(
  routeTemplate: string,
  requestPath: string
): Record<T, string> | null {
  if (routeTemplate === requestPath) {
    return {} as Record<T, string>
  }

  const formatParts = routeTemplate.split('/')
  const textParts = requestPath.split('/')
  const result: Partial<Record<T, string>> = {}

  let formatIndex = 0
  let textIndex = 0

  while (formatIndex < formatParts.length && textIndex < textParts.length) {
    const formatPart = formatParts[formatIndex]
    const textPart = textParts[textIndex]

    if (formatPart.startsWith(':')) {
      const key = formatPart.slice(1) as T
      result[key] = textPart
      formatIndex++
      textIndex++
    } else if (formatPart === textPart) {
      formatIndex++
      textIndex++
    } else {
      return null
    }
  }

  if (formatIndex !== formatParts.length || textIndex !== textParts.length) {
    return null
  }

  return result as Record<T, string>
}

export function toPath(str): string {
  return str.replace(RGX_WRONG_SEPARATOR_FILE_SYSTEM, path.sep)
}

export function toUrl(str): string {
  return str.replace(RGX_WRONG_SEPARATOR_URL, '/')
}

export function buildQuery(query: Record<string, string | number | boolean | undefined>): string {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      params.append(key, String(value))
    }
  }

  return params.toString()
}

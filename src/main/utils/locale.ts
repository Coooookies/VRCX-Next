import { execSync } from './exec'
import { LCID_DEFINITIONS } from '@shared/locale/lcid'
import type { LanguageCode } from '@shared/locale/types'

const defaultOptions = { spawn: true }
const defaultLocale = 'en-US'

function getStdOutSync(command: string, args?: string[]) {
  return execSync(command, args)
}

function getEnvLocale(env = process.env) {
  return env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE
}

function parseLocale(string: string) {
  const env = {}
  for (const definition of string.split('\n')) {
    const [key, value] = definition.split('=')
    env[key] = value.replace(/^"|"$/g, '')
  }

  return getEnvLocale(env)
}

function getLocale(string: string) {
  return string && string.replace(/[.:].*/, '').replace(/_/, '-')
}

function getLocalesSync() {
  return getStdOutSync('locale', ['-a'])
}

function getSupportedLocale(locale: string, locales = '') {
  return locales.includes(locale) ? locale : defaultLocale
}

function getAppleLocaleSync() {
  return getSupportedLocale(
    getStdOutSync('defaults', ['read', '-globalDomain', 'AppleLocale']),
    getLocalesSync()
  )
}

function getUnixLocaleSync() {
  return getLocale(parseLocale(getStdOutSync('locale'))!)
}

function getWinLocaleSync(): string {
  const stdout = getStdOutSync('wmic', ['os', 'get', 'locale'])
  const lcidCode = parseInt(stdout.replace('Locale', ''), 16)
  return LCID_DEFINITIONS[lcidCode]
}

const cache = new Map<boolean, string>()

export function locale(options = defaultOptions): LanguageCode {
  if (cache.has(options.spawn)) {
    return cache.get(options.spawn)! as LanguageCode
  }

  let locale
  try {
    const envLocale = getEnvLocale()

    if (envLocale || options.spawn === false) {
      locale = getLocale(envLocale!)
    } else if (process.platform === 'win32') {
      locale = getWinLocaleSync()
    } else if (process.platform === 'darwin') {
      locale = getAppleLocaleSync()
    } else {
      locale = getUnixLocaleSync()
    }
  } catch {
    locale = defaultLocale
  }

  const normalised = (locale || defaultLocale) as LanguageCode
  cache.set(options.spawn, normalised)
  return normalised
}

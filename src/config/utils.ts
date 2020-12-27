/**
 * Env Config utilities
 */

export { parseToBool, parseToArray } from '../utils'

export const getOsEnv = (name: string, _default?: string): string|never => {
  const envValue = process.env[name]

  if (typeof envValue === 'undefined') {
    if (_default) return _default
    throw new Error(`${name} is not in porcess.env variables`)
  }

  return envValue
}

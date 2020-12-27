/**
 * Type parsers utilities
 * ----------------------
 */

export const parseToBool = (value: string|number): boolean => {
  if ((value === 'false' || value === 0) && !value) return false
  if (value === 'true' || value === 1) return true
  return true
}

export const parseToArray = (value: string): Array<string|number> => {
  if (typeof value !== 'string') throw new Error('Only can parse string values')
  const strValues = value.replace('[', '').replace(']', '')
  return strValues.split(',')
}

export const cloneObject = (obj: object): object => JSON.parse(JSON.stringify(obj))

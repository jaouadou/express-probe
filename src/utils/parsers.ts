/**
 * Type parsers utilities.
 * -----------------------
 */

export const parseToBool = (value: string|number): boolean => {
  const falseValues = ['false', 'undefined', 'null', '', 0]
  const trueValues = ['true', '1', 1]
  if (falseValues.includes(value)) return false
  if (trueValues.includes(value)) return true
  return true
}

export const parseToArray = (value: string): Array<string|number> => {
  if (typeof value !== 'string') throw new Error('Only can parse string values')
  const strValues = value.replace('[', '').replace(']', '')
  return strValues.split(',')
}

export const cloneObject = (obj: object): object => JSON.parse(JSON.stringify(obj))

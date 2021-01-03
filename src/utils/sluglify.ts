/**
 * Sluglify.
 * ---------
 *
 * Covert a title, paragraph or any
 * text into a valid slug string.
 */

export const sluglifySync = (value: string, separator: string = '-'): string => {
  if (typeof value !== 'string') {
    throw new Error('sluglify expects a string value')
  }
  const slug = value
    .replace(/[ñÑ]/g, 'n')
    .split('')
    .reduce((result, word) => result + word.replace(/[^\w\s$*_+~.()'"!\-:@]+/g, ''), '')
    .trim()
    .toLowerCase()
    .replace(new RegExp('[\\s' + separator + ']+', 'g'), separator)
    .replace(new RegExp('[^a-zA-Z0-9' + separator + ']', 'g'), '')
    .replace(new RegExp('[\\s' + separator + ']+', 'g'), separator)
  return slug
}

export const sluglify = (value: string, separator: string = '-'): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const slug = sluglifySync(value, separator)
      return resolve(slug)
    } catch (error) {
      return reject(error)
    }
  })
}

/**
 * Http constants.
 * ---------------
 *
 */

export const httpStatus = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  preconditionFailed: 412,
  unprocessable: 422,
  serverError: 500,
}

export const mapCodeToMessage = (code: number): string => {
  switch (code) {
    case 200:
      return 'ok'
    case 201:
      return 'created'
    case 400:
      return 'bad request'
    case 401:
      return 'unauthorized'
    case 403:
      return 'action forbidden'
    case 404:
      return 'not found'
    case 409:
      return 'conflict with preexisting data'
    case 412:
      return 'precondition failed'
    case 422:
      return 'unprocessable entitie'
    case 500:
      return 'server error'
    default:
      return 'server error'
  }
}

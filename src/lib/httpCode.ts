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

export const mapCodeToMessage = {
  200: 'ok',
  201: 'created',
  400: 'bad request',
  401: 'unauthorized',
  403: 'action forbidden',
  404: 'not found',
  409: 'conflict with preexisting data',
  412: 'precondition failed',
  422: 'unprocessable entitie',
  500: 'server error',
}

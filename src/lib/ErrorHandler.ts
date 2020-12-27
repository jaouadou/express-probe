/**
 * Central error handler.
 * ----------------------
 *
 * Handle all error in a decicated object.
 */

import { ApiError } from './ApiError'

export class ErrorHandler {
  public static async handlError(errorObject: ApiError): Promise<ApiError> {
    let error = errorObject
    if (!(error instanceof ApiError)) {
      error = new ApiError(500, errorObject.message, {})
      await error.toOperational()
    }
    await error.logError()
    await error.sendEmailIfOperational()

    return error
  }
}

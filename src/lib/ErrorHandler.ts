/**
 * Central error handler.
 * ----------------------
 *
 * Handle all error in a decicated object.
 */

import { ApiError } from './ApiError'
import { Logger } from './logger'

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

  public static handleFatalError(err: Error): never {
    Logger.error(err.message)
    Logger.error(err.stack)
    process.exit(1)
  }
}

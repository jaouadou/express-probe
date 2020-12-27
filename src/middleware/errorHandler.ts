/**
 * Central error handler middleware.
 * ---------------------------------
 *
 * All error must be passed trhough next function
 * to this middleware to be handle properly and
 * return a homegenized error response.
 *
 */

import { Request, Response, NextFunction } from 'express'
import { ErrorHandler, ApiError } from '../lib'
import { errorResponse, ErrorResponse } from '../core'

export const centralErrorHandler = async (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<ErrorResponse> => {
  const error = await ErrorHandler.handlError(err)
  return errorResponse(req, res, error)
}

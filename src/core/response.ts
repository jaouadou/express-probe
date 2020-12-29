/**
 * Homegenized response function.
 * ------------------------------
 *
 * Return a custom response object with
 * extra properties to send info to client.
 */

import { Request, Response } from 'express'
import { ApiError, httpStatus, mapCodeToMessage } from '../lib'
import { GenericObject } from '../interfaces'
import config from '../config'

export type SuccessResponse = Response<GenericObject>
export type ErrorResponse = Response<GenericObject>
export type DataResponse = GenericObject | GenericObject[]

export const successResponse = (
  req: Request,
  res: Response,
  data: DataResponse,
  status?: number,
  message?: string,
): SuccessResponse => {
  const statusCode = status || httpStatus.ok
  const statusMessage = message || mapCodeToMessage(statusCode)

  return res.status(statusCode).json({
    error: false,
    message: statusMessage,
    data: data || {},
  })
}

export const errorResponse = (
  req: Request,
  res: Response,
  error: ApiError,
): ErrorResponse => {
  const statusCode = error.status || httpStatus.serverError
  const statusMessage = error.message || mapCodeToMessage(statusCode)

  const errorObject = {
    error: true,
    data: error.data || {},
    message: '',
  }
  if (config.app.IS_PRODUCTION && statusCode === httpStatus.serverError) {
    errorObject.message = mapCodeToMessage(httpStatus.serverError)
  } else {
    errorObject.message = statusMessage
  }

  return res.status(statusCode).json(errorObject)
}

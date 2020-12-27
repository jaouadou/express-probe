/**
 * ApiError class.
 * ---------------
 *
 * Custom error extended from native js Error
 * that allow handle http errors with a optimized
 * form to manage the error.
 */

import { Logger } from './logger'
import { httpStatus } from './httpCode'

export class ApiError extends Error {
  public readonly status: number
  public readonly data: Record<string, any>

  public isOperational: boolean

  constructor(status: number, message: string, data: Record<string, any>, isOperational?: boolean) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)

    this.status = status
    this.data = data || {}
    this.isOperational = isOperational || false

    Error.captureStackTrace(this)
  }

  async toOperational(): Promise<void> {
    this.isOperational = true
  }

  async logError(): Promise<void> {
    Logger.error(`Message: ${this.message} - Data: ${JSON.stringify(this.data)}`)
    if (this.isOperational) {
      Logger.error('Stack', this.stack)
    }
  }

  async sendEmailIfOperational(): Promise<void> {
    if (this.isOperational) {
      Logger.info('Send Error Email...')
      // TODO: send email to admin
    }
  }

  public static raise = {
    badRequest: (message: string = 'bad request', data: Record<string, any> = {}): never => {
      throw new ApiError(httpStatus.badRequest, message, data)
    },
    unauthorized: (message: string = 'unauthorized', data: Record<string, any> = {}): never => {
      throw new ApiError(httpStatus.unauthorized, message, data)
    },
    forbidden: (message: string = 'forbidden', data: Record<string, any> = {}): never => {
      throw new ApiError(httpStatus.forbidden, message, data)
    },
    notFound: (message: string = 'not found', data: Record<string, any> = {}): never => {
      throw new ApiError(httpStatus.notFound, message, data)
    },
    conflict: (
      message: string = 'conflict with preexisting data',
      data: Record<string, any> = {},
    ): never => {
      throw new ApiError(httpStatus.conflict, message, data)
    },
    preconditionFailed: (
      message: string = 'precondition failed',
      data: Record<string, any> = {},
    ): never => {
      throw new ApiError(httpStatus.preconditionFailed, message, data)
    },
    unprocessable: (message: string = 'bad request', data: Record<string, any> = {}): never => {
      throw new ApiError(httpStatus.unprocessable, message, data)
    },
  }
}

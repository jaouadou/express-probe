/**
 * Not found handler middleware.
 * -----------------------------
 */

import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../lib'

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  try {
    ApiError.raise.notFound('resource not found')
  } catch (error) {
    next(error)
  }
}

/**
 * Request limiter middleware.
 * ---------------------------
 */

import { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import config from '../config'
import { GenericObject } from '../interfaces'
import { cacheClient } from '../services/cache'

const dummyLimiter = (req: Request, res: Response, next: NextFunction) => next()

export const RequestLimiter = (requestsPerMinute?: number) => {
  const limiterOpts: GenericObject = {
    windowMs: 1 * 60 * 1000,
    max: requestsPerMinute || config.api.MAX_REQUEST_PER_MINUTE,
  }
  if (config.api.CACHE_REQUESTS) {
    const RedisStore = require('rate-limit-redis')
    limiterOpts.store = new RedisStore({ client: cacheClient })
  }
  if (config.app.IS_TEST) return dummyLimiter
  return rateLimit(limiterOpts)
}

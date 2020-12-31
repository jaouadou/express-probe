/**
 * Redis client connection.
 * ------------------------
 *
 * Handle redis connection and client
 * events configuration.
 */

import redis from 'redis'
import config from '../../config'
import { ErrorHandler, Logger } from '../../lib'

export const cacheClient = redis.createClient(config.redis.URL)

cacheClient.on('ready', () => {
  Logger.info('Redis connected')
})

cacheClient.on('error', (err) => {
  ErrorHandler.handlError(err)
})

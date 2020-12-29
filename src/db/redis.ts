/**
 * Redis client connection.
 * ------------------------
 *
 * Handle redis connection and client
 * events configuration.
 */

import redis from 'redis'
import config from '../config'
import { ErrorHandler, Logger } from '../lib'

export const redisClient = redis.createClient(config.redis.URL)

redisClient.on('ready', () => {
  Logger.info('Redis connected')
})

redisClient.on('error', (err) => {
  ErrorHandler.handlError(err)
})

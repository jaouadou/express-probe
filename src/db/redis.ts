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

export const client = redis.createClient(config.redis.URL)

client.on('ready', () => {
  Logger.info('Redis connected')
})

client.on('error', (err) => {
  ErrorHandler.handlError(err)
})
